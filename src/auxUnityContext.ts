import { UnityContext } from "react-unity-webgl"

var unityContext:(UnityContext | undefined)= undefined
var folder:string = ""
var filesName:string = ""

export const setUnityContext = (newFolder:string, newFilesName:string) => {
    if(folder !== newFolder || filesName !== newFilesName){
        unityContext = new UnityContext({
            loaderUrl: "public/unitybuild/" + newFolder + "/" + newFilesName + ".loader.js",
            dataUrl: "public/unitybuild/" + newFolder + "/" + newFilesName + ".data",
            frameworkUrl: "public/unitybuild/" + newFolder + "/" + newFilesName + ".framework.js",
            codeUrl: "public/unitybuild/" + newFolder + "/" + newFilesName + ".wasm"
        })
        folder = newFolder
        filesName = newFilesName
    }
    return unityContext
}

export const getUnityContext = () => {
    return unityContext
}

export const isSetUnityContext = () => {
    return unityContext !== undefined
}

