import type { Readable } from 'stream';

import type {
	IBinaryKeyData,
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IRequestOptionsSimplified,
	JsonObject,
} from 'n8n-workflow';

import {
	BINARY_ENCODING,
	NodeApiError,
	NodeOperationError,
	jsonParse,
	removeCircularRefs,
	sleep,
} from 'n8n-workflow';

import type { OptionsWithUri } from 'request-promise-native';

import {
	BodyParameter,
	IAuthDataSanitizeKeys,
	binaryContentTypes,
	getOAuth2AdditionalParameters,
	prepareRequestBody,
	reduceAsync,
	replaceNullValues,
	sanitizeUiMessage,
	keysToLowercase
} from '../../srcs/utils/GenericFunctions';

import { nodeDescription } from './HttpRequest.node.options';
import { getCredentials, getProxy } from '../../srcs/services/proxy.service';

function toText<T>(data: T) {
	if (typeof data === 'object' && data !== null) {
		return JSON.stringify(data);
	}
	return data;
}
export class HttpRequest implements INodeType {
	description: INodeTypeDescription = nodeDescription;

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const nodeVersion = this.getNode().typeVersion;

		const fullResponseProperties = ['body', 'headers', 'statusCode', 'statusMessage'];

		let authentication;

		try {
			authentication = this.getNodeParameter('authentication', 0) as
				| 'predefinedCredentialType'
				| 'genericCredentialType'
				| 'none';
		} catch { }

		let httpBasicAuth;
		let httpDigestAuth;
		let httpHeaderAuth;
		let httpQueryAuth;
		let httpCustomAuth;
		let oAuth1Api;
		let oAuth2Api;
		let nodeCredentialType;

		if (authentication === 'genericCredentialType') {
			const genericAuthType = this.getNodeParameter('genericAuthType', 0) as string;

			if (genericAuthType === 'httpBasicAuth') {
				try {
					httpBasicAuth = await this.getCredentials('httpBasicAuth');
				} catch { }
			} else if (genericAuthType === 'httpDigestAuth') {
				try {
					httpDigestAuth = await this.getCredentials('httpDigestAuth');
				} catch { }
			} else if (genericAuthType === 'httpHeaderAuth') {
				try {
					httpHeaderAuth = await this.getCredentials('httpHeaderAuth');
				} catch { }
			} else if (genericAuthType === 'httpQueryAuth') {
				try {
					httpQueryAuth = await this.getCredentials('httpQueryAuth');
				} catch { }
			} else if (genericAuthType === 'httpCustomAuth') {
				try {
					httpCustomAuth = await this.getCredentials('httpCustomAuth');
				} catch { }
			} else if (genericAuthType === 'oAuth1Api') {
				try {
					oAuth1Api = await this.getCredentials('oAuth1Api');
				} catch { }
			} else if (genericAuthType === 'oAuth2Api') {
				try {
					oAuth2Api = await this.getCredentials('oAuth2Api');
				} catch { }
			}
		} else if (authentication === 'predefinedCredentialType') {
			try {
				nodeCredentialType = this.getNodeParameter('nodeCredentialType', 0) as string;
			} catch { }
		}

		type RequestOptions = OptionsWithUri & { useStream?: boolean };
		let requestOptions: RequestOptions = {
			uri: '',
		};

		let returnItems: INodeExecutionData[] = [];
		const requestPromises = [];

		let fullResponse = false;

		let autoDetectResponseFormat = false;

		let helloSafeProxyCredentials = getCredentials();
		let helloSafeProxy: string | undefined;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const requestMethod = this.getNodeParameter('method', itemIndex) as string;

			const sendQuery = this.getNodeParameter('sendQuery', itemIndex, false) as boolean;
			const queryParameters = this.getNodeParameter(
				'queryParameters.parameters',
				itemIndex,
				[],
			) as [{ name: string; value: string }];
			const specifyQuery = this.getNodeParameter('specifyQuery', itemIndex, 'keypair') as string;
			const jsonQueryParameter = this.getNodeParameter('jsonQuery', itemIndex, '') as string;

			const sendBody = this.getNodeParameter('sendBody', itemIndex, false) as boolean;
			const bodyContentType = this.getNodeParameter('contentType', itemIndex, '') as string;
			const specifyBody = this.getNodeParameter('specifyBody', itemIndex, '') as string;
			const bodyParameters = this.getNodeParameter(
				'bodyParameters.parameters',
				itemIndex,
				[],
			) as BodyParameter[];
			const jsonBodyParameter = this.getNodeParameter('jsonBody', itemIndex, '') as string;
			const body = this.getNodeParameter('body', itemIndex, '') as string;

			const sendHeaders = this.getNodeParameter('sendHeaders', itemIndex, false) as boolean;

			const headerParameters = this.getNodeParameter(
				'headerParameters.parameters',
				itemIndex,
				[],
			) as [{ name: string; value: string }];

			const specifyHeaders = this.getNodeParameter(
				'specifyHeaders',
				itemIndex,
				'keypair',
			) as string;

			const jsonHeadersParameter = this.getNodeParameter('jsonHeaders', itemIndex, '') as string;

			const {
				redirect,
				batching,
				proxy,
				timeout,
				allowUnauthorizedCerts,
				queryParameterArrays,
				response,
			} = this.getNodeParameter('options', itemIndex, {}) as {
				batching: { batch: { batchSize: number; batchInterval: number } };
				proxy: string;
				timeout: number;
				allowUnauthorizedCerts: boolean;
				queryParameterArrays: 'indices' | 'brackets' | 'repeat';
				response: {
					response: { neverError: boolean; responseFormat: string; fullResponse: boolean };
				};
				redirect: { redirect: { maxRedirects: number; followRedirects: boolean } };
			};

			const url = this.getNodeParameter('url', itemIndex) as string;

			const responseFormat = response?.response?.responseFormat || 'autodetect';

			fullResponse = response?.response?.fullResponse || false;

			autoDetectResponseFormat = responseFormat === 'autodetect';

			// defaults batch size to 1 of it's set to 0
			const batchSize = batching?.batch?.batchSize > 0 ? batching?.batch?.batchSize : 1;
			const batchInterval = batching?.batch.batchInterval;

			if (itemIndex > 0 && batchSize >= 0 && batchInterval > 0) {
				if (itemIndex % batchSize === 0) {
					await sleep(batchInterval);
				}
			}

			requestOptions = {
				headers: {},
				method: requestMethod,
				uri: url,
				gzip: true,
				rejectUnauthorized: !allowUnauthorizedCerts || false,
				followRedirect: false,
			};

			// When response format is set to auto-detect,
			// we need to access to response header content-type
			// and the only way is using "resolveWithFullResponse"
			if (autoDetectResponseFormat || fullResponse) {
				requestOptions.resolveWithFullResponse = true;
			}

			if (requestOptions.method !== 'GET' && nodeVersion >= 4.1) {
				requestOptions = { ...requestOptions, followAllRedirects: false };
			}

			const defaultRedirect = nodeVersion >= 4 && redirect === undefined;

			if (redirect?.redirect?.followRedirects || defaultRedirect) {
				requestOptions.followRedirect = true;
				requestOptions.followAllRedirects = true;
			}

			if (redirect?.redirect?.maxRedirects || defaultRedirect) {
				requestOptions.maxRedirects = redirect?.redirect?.maxRedirects;
			}

			if (response?.response?.neverError) {
				requestOptions.simple = false;
			}

			if (proxy) {
				requestOptions.proxy = proxy;
			} else if (helloSafeProxyCredentials.username && helloSafeProxyCredentials.password) {
				helloSafeProxy = await getProxy();
				requestOptions.proxy = `http://${helloSafeProxyCredentials.username}:${helloSafeProxyCredentials.password}@${helloSafeProxy}`;
			}

			if (timeout) {
				requestOptions.timeout = timeout;
			} else {
				// set default timeout to 5 minutes
				requestOptions.timeout = 300_000;
			}
			if (sendQuery && queryParameterArrays) {
				Object.assign(requestOptions, {
					qsStringifyOptions: { arrayFormat: queryParameterArrays },
				});
			}

			const parametersToKeyValue = async (
				accumulator: { [key: string]: any },
				cur: { name: string; value: string; parameterType?: string; inputDataFieldName?: string },
			) => {
				if (cur.parameterType === 'formBinaryData') {
					if (!cur.inputDataFieldName) return accumulator;
					const binaryData = this.helpers.assertBinaryData(itemIndex, cur.inputDataFieldName);
					let uploadData: Buffer | Readable;
					const itemBinaryData = items[itemIndex].binary![cur.inputDataFieldName];
					if (itemBinaryData.id) {
						uploadData = await this.helpers.getBinaryStream(itemBinaryData.id);
					} else {
						uploadData = Buffer.from(itemBinaryData.data, BINARY_ENCODING);
					}

					accumulator[cur.name] = {
						value: uploadData,
						options: {
							filename: binaryData.fileName,
							contentType: binaryData.mimeType,
						},
					};
					return accumulator;
				}
				accumulator[cur.name] = cur.value;
				return accumulator;
			};

			// Get parameters defined in the UI
			if (sendBody && bodyParameters) {
				if (specifyBody === 'keypair' || bodyContentType === 'multipart-form-data') {
					requestOptions.body = await prepareRequestBody(
						bodyParameters,
						bodyContentType,
						nodeVersion,
						parametersToKeyValue,
					);
				} else if (specifyBody === 'json') {
					// body is specified using JSON
					if (typeof jsonBodyParameter !== 'object' && jsonBodyParameter !== null) {
						try {
							JSON.parse(jsonBodyParameter);
						} catch {
							throw new NodeOperationError(
								this.getNode(),
								'JSON parameter need to be an valid JSON',
								{
									itemIndex,
								},
							);
						}

						requestOptions.body = jsonParse(jsonBodyParameter);
					} else {
						requestOptions.body = jsonBodyParameter;
					}
				} else if (specifyBody === 'string') {
					//form urlencoded
					requestOptions.body = Object.fromEntries(new URLSearchParams(body));
				}
			}

			// Change the way data get send in case a different content-type than JSON got selected
			if (sendBody && ['PATCH', 'POST', 'PUT', 'GET'].includes(requestMethod)) {
				if (bodyContentType === 'multipart-form-data') {
					requestOptions.formData = requestOptions.body;
					delete requestOptions.body;
				} else if (bodyContentType === 'form-urlencoded') {
					requestOptions.form = requestOptions.body;
					delete requestOptions.body;
				} else if (bodyContentType === 'binaryData') {
					const inputDataFieldName = this.getNodeParameter(
						'inputDataFieldName',
						itemIndex,
					) as string;

					let uploadData: Buffer | Readable;
					let contentLength: number;

					const itemBinaryData = this.helpers.assertBinaryData(itemIndex, inputDataFieldName);

					if (itemBinaryData.id) {
						uploadData = await this.helpers.getBinaryStream(itemBinaryData.id);
						const metadata = await this.helpers.getBinaryMetadata(itemBinaryData.id);
						contentLength = metadata.fileSize;
					} else {
						uploadData = Buffer.from(itemBinaryData.data, BINARY_ENCODING);
						contentLength = uploadData.length;
					}
					requestOptions.body = uploadData;
					requestOptions.headers = {
						...requestOptions.headers,
						'content-length': contentLength,
						'content-type': itemBinaryData.mimeType ?? 'application/octet-stream',
					};
				} else if (bodyContentType === 'raw') {
					requestOptions.body = body;
				}
			}

			// Get parameters defined in the UI
			if (sendQuery && queryParameters) {
				if (specifyQuery === 'keypair') {
					requestOptions.qs = await reduceAsync(queryParameters, parametersToKeyValue);
				} else if (specifyQuery === 'json') {
					// query is specified using JSON
					try {
						JSON.parse(jsonQueryParameter);
					} catch {
						throw new NodeOperationError(
							this.getNode(),
							'JSON parameter need to be an valid JSON',
							{
								itemIndex,
							},
						);
					}

					requestOptions.qs = jsonParse(jsonQueryParameter);
				}
			}

			// Get parameters defined in the UI
			if (sendHeaders && headerParameters) {
				let additionalHeaders: IDataObject = {};
				if (specifyHeaders === 'keypair') {
					additionalHeaders = await reduceAsync(headerParameters, parametersToKeyValue);
				} else if (specifyHeaders === 'json') {
					// body is specified using JSON
					try {
						JSON.parse(jsonHeadersParameter);
					} catch {
						throw new NodeOperationError(
							this.getNode(),
							'JSON parameter need to be an valid JSON',
							{
								itemIndex,
							},
						);
					}

					additionalHeaders = jsonParse(jsonHeadersParameter);
				}
				requestOptions.headers = {
					...requestOptions.headers,
					...keysToLowercase(additionalHeaders),
				};
			}

			if (autoDetectResponseFormat || responseFormat === 'file') {
				requestOptions.encoding = null;
				requestOptions.json = false;
				requestOptions.useStream = true;
			} else if (bodyContentType === 'raw') {
				requestOptions.json = false;
				requestOptions.useStream = true;
			} else {
				requestOptions.json = true;
			}

			// // Add Content Type if any are set
			if (bodyContentType === 'raw') {
				if (requestOptions.headers === undefined) {
					requestOptions.headers = {};
				}
				const rawContentType = this.getNodeParameter('rawContentType', itemIndex) as string;
				requestOptions.headers['content-type'] = rawContentType;
			}

			const authDataKeys: IAuthDataSanitizeKeys = {};

			// Add credentials if any are set
			if (httpBasicAuth !== undefined) {
				requestOptions.auth = {
					user: httpBasicAuth.user as string,
					pass: httpBasicAuth.password as string,
				};
				authDataKeys.auth = ['pass'];
			}
			if (httpHeaderAuth !== undefined) {
				requestOptions.headers![httpHeaderAuth.name as string] = httpHeaderAuth.value;
				authDataKeys.headers = [httpHeaderAuth.name as string];
			}
			if (httpQueryAuth !== undefined) {
				if (!requestOptions.qs) {
					requestOptions.qs = {};
				}
				requestOptions.qs[httpQueryAuth.name as string] = httpQueryAuth.value;
				authDataKeys.qs = [httpQueryAuth.name as string];
			}
			if (httpDigestAuth !== undefined) {
				requestOptions.auth = {
					user: httpDigestAuth.user as string,
					pass: httpDigestAuth.password as string,
					sendImmediately: false,
				};
				authDataKeys.auth = ['pass'];
			}
			if (httpCustomAuth !== undefined) {
				const customAuth = jsonParse<IRequestOptionsSimplified>(
					(httpCustomAuth.json as string) || '{}',
					{ errorMessage: 'Invalid Custom Auth JSON' },
				);
				if (customAuth.headers) {
					requestOptions.headers = { ...requestOptions.headers, ...customAuth.headers };
					authDataKeys.headers = Object.keys(customAuth.headers);
				}
				if (customAuth.body) {
					requestOptions.body = { ...requestOptions.body, ...customAuth.body };
					authDataKeys.body = Object.keys(customAuth.body);
				}
				if (customAuth.qs) {
					requestOptions.qs = { ...requestOptions.qs, ...customAuth.qs };
					authDataKeys.qs = Object.keys(customAuth.qs);
				}
			}

			if (requestOptions.headers!.accept === undefined) {
				if (responseFormat === 'json') {
					requestOptions.headers!.accept = 'application/json,text/*;q=0.99';
				} else if (responseFormat === 'text') {
					requestOptions.headers!.accept =
						'application/json,text/html,application/xhtml+xml,application/xml,text/*;q=0.9, */*;q=0.1';
				} else {
					requestOptions.headers!.accept =
						'application/json,text/html,application/xhtml+xml,application/xml,text/*;q=0.9, image/*;q=0.8, */*;q=0.7';
				}
			}
			try {
				this.sendMessageToUI(sanitizeUiMessage(requestOptions, authDataKeys));
			} catch (e) { }
			if (authentication === 'genericCredentialType' || authentication === 'none') {
				if (oAuth1Api) {
					const requestOAuth1 = this.helpers.requestOAuth1.call(this, 'oAuth1Api', requestOptions);
					requestOAuth1.catch(() => { });
					requestPromises.push(requestOAuth1);
				} else if (oAuth2Api) {
					const requestOAuth2 = this.helpers.requestOAuth2.call(this, 'oAuth2Api', requestOptions, {
						tokenType: 'Bearer',
					});
					requestOAuth2.catch(() => { });
					requestPromises.push(requestOAuth2);
				} else {
					// bearerAuth, queryAuth, headerAuth, digestAuth, none
					const request = this.helpers.request(requestOptions);
					request.catch(() => { });
					requestPromises.push(request);
				}
			} else if (authentication === 'predefinedCredentialType' && nodeCredentialType) {
				const additionalOAuth2Options = getOAuth2AdditionalParameters(nodeCredentialType);

				// service-specific cred: OAuth1, OAuth2, plain

				const requestWithAuthentication = this.helpers.requestWithAuthentication.call(
					this,
					nodeCredentialType,
					requestOptions,
					additionalOAuth2Options && { oauth2: additionalOAuth2Options },
				);
				requestWithAuthentication.catch(() => { });
				requestPromises.push(requestWithAuthentication);
			}
		}
		const promisesResponses = await Promise.allSettled(requestPromises);

		let response: any;
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			response = promisesResponses.shift();
			if (response!.status !== 'fulfilled') {
				if (response.reason.statusCode === 429) {
					response.reason.message =
						"Try spacing your requests out using the batching settings under 'Options'";
				}
				if (!this.continueOnFail()) {
					if (autoDetectResponseFormat && response.reason.error instanceof Buffer) {
						response.reason.error = Buffer.from(response.reason.error as Buffer).toString();
					}
					throw new NodeApiError(this.getNode(), response as JsonObject, { itemIndex });
				} else {
					removeCircularRefs(response.reason as JsonObject);
					// Return the actual reason as error
					returnItems.push({
						json: {
							error: response.reason,
						},
						pairedItem: {
							item: itemIndex,
						},
					});
					continue;
				}
			}

			response = response.value;

			let responseFormat = this.getNodeParameter(
				'options.response.response.responseFormat',
				0,
				'autodetect',
			) as string;

			fullResponse = this.getNodeParameter(
				'options.response.response.fullResponse',
				0,
				false,
			) as boolean;

			if (autoDetectResponseFormat) {
				const responseContentType = response.headers['content-type'] ?? '';
				if (responseContentType.includes('application/json')) {
					responseFormat = 'json';
					const neverError = this.getNodeParameter(
						'options.response.response.neverError',
						0,
						false,
					) as boolean;

					const data = await this.helpers
						.binaryToBuffer(response.body as Buffer | Readable)
						.then((body) => body.toString());
					response.body = jsonParse(data, {
						...(neverError
							? { fallbackValue: {} }
							: { errorMessage: 'Invalid JSON in response body' }),
					});
				} else if (binaryContentTypes.some((e) => responseContentType.includes(e))) {
					responseFormat = 'file';
				} else {
					responseFormat = 'text';
					const data = await this.helpers
						.binaryToBuffer(response.body as Buffer | Readable)
						.then((body) => body.toString());
					response.body = !data ? undefined : data;
				}
			}

			if (autoDetectResponseFormat && !fullResponse) {
				delete response.headers;
				delete response.statusCode;
				delete response.statusMessage;
				response = response.body;
				requestOptions.resolveWithFullResponse = false;
			}

			if (responseFormat === 'file') {
				const outputPropertyName = this.getNodeParameter(
					'options.response.response.outputPropertyName',
					0,
					'data',
				) as string;

				const newItem: INodeExecutionData = {
					json: {},
					binary: {},
					pairedItem: {
						item: itemIndex,
					},
				};

				if (items[itemIndex].binary !== undefined) {
					// Create a shallow copy of the binary data so that the old
					// data references which do not get changed still stay behind
					// but the incoming data does not get changed.
					Object.assign(newItem.binary as IBinaryKeyData, items[itemIndex].binary);
				}

				let binaryData: Buffer | Readable;
				if (fullResponse) {
					const returnItem: IDataObject = {};
					for (const property of fullResponseProperties) {
						if (property === 'body') {
							continue;
						}
						returnItem[property] = response![property];
					}

					newItem.json = returnItem;
					binaryData = response!.body;
				} else {
					newItem.json = items[itemIndex].json;
					binaryData = response;
				}
				newItem.binary![outputPropertyName] = await this.helpers.prepareBinaryData(binaryData);

				returnItems.push(newItem);
			} else if (responseFormat === 'text') {
				const outputPropertyName = this.getNodeParameter(
					'options.response.response.outputPropertyName',
					0,
					'data',
				) as string;
				if (fullResponse) {
					const returnItem: IDataObject = {};
					for (const property of fullResponseProperties) {
						if (property === 'body') {
							returnItem[outputPropertyName] = toText(response![property]);
							continue;
						}

						returnItem[property] = response![property];
					}
					returnItems.push({
						json: returnItem,
						pairedItem: {
							item: itemIndex,
						},
					});
				} else {
					returnItems.push({
						json: {
							[outputPropertyName]: toText(response),
						},
						pairedItem: {
							item: itemIndex,
						},
					});
				}
			} else {
				// responseFormat: 'json'
				if (requestOptions.resolveWithFullResponse === true) {
					const returnItem: IDataObject = {};
					for (const property of fullResponseProperties) {
						returnItem[property] = response![property];
					}

					if (responseFormat === 'json' && typeof returnItem.body === 'string') {
						try {
							returnItem.body = JSON.parse(returnItem.body);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								'Response body is not valid JSON. Change "Response Format" to "Text"',
								{ itemIndex },
							);
						}
					}

					returnItems.push({
						json: returnItem,
						pairedItem: {
							item: itemIndex,
						},
					});
				} else {
					if (responseFormat === 'json' && typeof response === 'string') {
						try {
							response = JSON.parse(response);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								'Response body is not valid JSON. Change "Response Format" to "Text"',
								{ itemIndex },
							);
						}
					}

					if (Array.isArray(response)) {
						// eslint-disable-next-line @typescript-eslint/no-loop-func
						response.forEach((item) =>
							returnItems.push({
								json: item,
								pairedItem: {
									item: itemIndex,
								},
							}),
						);
					} else {
						returnItems.push({
							json: response,
							pairedItem: {
								item: itemIndex,
							},
						});
					}
				}
			}
		}

		returnItems = returnItems.map(replaceNullValues);

		if (helloSafeProxy) {
			returnItems.map(returnItem => {
				returnItem.json.proxyUsed = helloSafeProxy
			});
		}

		return [returnItems];
	}
}
