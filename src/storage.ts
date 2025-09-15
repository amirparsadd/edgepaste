import { S3 } from "./env";

export async function set(key: string, value: string): Promise<void> {
    const url = `https://${S3.bucket}.${S3.endpoint}/${key}`;
    const dateValue = new Date().toUTCString();
    const contentType = "text/plain";

    const stringToSign = `PUT\n\n${contentType}\n${dateValue}\n/${S3.bucket}/${key}`;
    const signature = await generateSignature(stringToSign, S3.secretKey);

    const headers = {
        "Host": `${S3.bucket}.${S3.endpoint}`,
        "Date": dateValue,
        "Content-Type": contentType,
        "Authorization": `AWS ${S3.accessKey}:${signature}`,
    };

    const response = await fetch(url, {
        method: "PUT",
        headers: headers,
        body: value,
    });

    if (!response.ok) {
        throw new Error(`Failed to set key "${key}": ${response.statusText}`);
    }
}

export async function get(key: string): Promise<string | null> {
    const url = `https://${S3.bucket}.${S3.endpoint}/${key}`;
    const dateValue = new Date().toUTCString();

    const stringToSign = `GET\n\n\n${dateValue}\n/${S3.bucket}/${key}`;
    const signature = await generateSignature(stringToSign, S3.secretKey);

    const headers = {
        "Host": `${S3.bucket}.${S3.endpoint}`,
        "Date": dateValue,
        "Authorization": `AWS ${S3.accessKey}:${signature}`,
    };

    const response = await fetch(url, {
        method: "GET",
        headers: headers,
    });

    if (response.ok) {
        return await response.text();
    } else if (response.status === 404) {
        return null; // Key does not exist
    } else {
        throw new Error(`Failed to get key "${key}": ${response.statusText}`);
    }
}

export async function remove(key: string): Promise<void> {
    const url = `https://${S3.bucket}.${S3.endpoint}/${key}`;
    const dateValue = new Date().toUTCString();

    const stringToSign = `DELETE\n\n\n${dateValue}\n/${S3.bucket}/${key}`;
    const signature = await generateSignature(stringToSign, S3.secretKey);

    const headers = {
        "Host": `${S3.bucket}.${S3.endpoint}`,
        "Date": dateValue,
        "Authorization": `AWS ${S3.accessKey}:${signature}`,
    };

    const response = await fetch(url, {
        method: "DELETE",
        headers: headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to remove key "${key}": ${response.statusText}`);
    }
}

async function generateSignature(stringToSign: string, secretKey: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);
    const stringData = encoder.encode(stringToSign);

    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: { name: "SHA-1" } },
        false,
        ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, stringData);
    return btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
}
