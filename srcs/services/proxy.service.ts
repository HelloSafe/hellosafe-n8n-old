import * as fs from 'fs';
import { join } from 'path';

export async function getProxy(): Promise<string> {
    const data = fs.readFileSync(
        join(process.cwd(), './assets/proxies.txt'),
        'utf8',
    );
    const proxies = data.split(/\r?\n/);
    const lineCount = proxies.length;
    const randomLineNumber = Math.floor(Math.random() * lineCount);
    return proxies[randomLineNumber];
}

export function getCredentials(): { username: string; password: string } {
    return {
        username: process.env.PROXY_USERNAME ?? "",
        password: process.env.PROXY_PASSWORD ?? "",
    };
}