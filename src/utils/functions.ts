import { mimetypes, NamesUnityModel } from "./consts"
import { SetUnityModelMode, UnityModel } from "./types"

export const enumToSelect = (e: any) => {
    return Object.entries(e).map(([key, value]) => ({ label: value as string, value: value }))
}

export const getObjOptions = (type: string, suffix: string): any => {
    return {
        "maxFiles": 1,
        "accept": {
            [type]: [
                suffix
            ]
        }
    }
}

export const getUrlIfBase64 = (unityModel: UnityModel, name: NamesUnityModel): string => {
    const val = unityModel.unityFiles[name]
    if (unityModel.setFilesMode === SetUnityModelMode.dragDrop) {
        return `data:${mimetypes[name]};base64,${val}`;
    } else {
        return val
    }
}

export const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    let bytes = new Uint8Array(buffer); // Convierte el ArrayBuffer en un Uint8Array
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary); // Codifica en Base64
}

export const base64ToArrayBuffer = (base64: string) => {
    let binary = atob(base64); // Decodifica el Base64
    let length = binary.length;
    let buffer = new ArrayBuffer(length);
    let bytes = new Uint8Array(buffer);
    for (let i = 0; i < length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return buffer;
}

export const generateRandomKey = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const hasDuplicateKeys = (objects: any[]): boolean => {
    const keySet = new Set<string>();

    for (const obj of objects) {
        for (const key of Object.keys(obj)) {
            if (keySet.has(key)) {
                return true;
            }
            keySet.add(key);
        }
    }

    return false;
}

export const safeMergeLists = (list: any[]): any => {
    if(!hasDuplicateKeys(list)){
        return list.reduce((acc, obj) => ({ ...acc, ...obj }), {});
    }
    return list
}

export const getListGroupId = (group: string) => {
    return group.split(";").map((s: string) => s.trim())
}
