"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ExampleNode = void 0;
var n8n_workflow_1 = require("n8n-workflow");
var ExampleNode = /** @class */ (function () {
    function ExampleNode() {
        this.description = {
            displayName: 'Example Node final',
            name: 'exampleNode',
            group: ['transform'],
            version: 1,
            description: 'Basic Example Node final',
            defaults: {
                name: 'Example Node final'
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                // Node properties which the user gets displayed and
                // can change on the node.
                {
                    displayName: 'My String',
                    name: 'myString',
                    type: 'string',
                    "default": '',
                    placeholder: 'Placeholder value',
                    description: 'The description text'
                },
            ]
        };
    }
    // The function below is responsible for actually doing whatever this node
    // is supposed to do. In this case, we're just appending the `myString` property
    // with whatever the user has entered.
    // You can make async calls and use `await`.
    ExampleNode.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, item, myString, itemIndex;
            return __generator(this, function (_a) {
                items = this.getInputData();
                // Iterates over all input items and add the key "myString" with the
                // value the parameter "myString" resolves to.
                // (This could be a different value for each item in case it contains an expression)
                for (itemIndex = 0; itemIndex < items.length; itemIndex++) {
                    try {
                        myString = this.getNodeParameter('myString', itemIndex, '');
                        item = items[itemIndex];
                        item.json['myString'] = myString;
                    }
                    catch (error) {
                        // This node should never fail but we want to showcase how
                        // to handle errors.
                        if (this.continueOnFail()) {
                            items.push({ json: this.getInputData(itemIndex)[0].json, error: error, pairedItem: itemIndex });
                        }
                        else {
                            // Adding `itemIndex` allows other workflows to handle this error
                            if (error.context) {
                                // If the error thrown already contains the context property,
                                // only append the itemIndex
                                error.context.itemIndex = itemIndex;
                                throw error;
                            }
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                                itemIndex: itemIndex
                            });
                        }
                    }
                }
                return [2 /*return*/, this.prepareOutputData(items)];
            });
        });
    };
    return ExampleNode;
}());
exports.ExampleNode = ExampleNode;
