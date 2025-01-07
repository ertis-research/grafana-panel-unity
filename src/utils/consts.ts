
export type NamesUnityModel = "loaderUrl" | "dataUrl" | "frameworkUrl" | "codeUrl"

export const mimetypes: Record<NamesUnityModel, string> = {
    loaderUrl: "data:text/javascript",
    dataUrl: "data:application/octet-stream",
    frameworkUrl: "data:text/javascript",
    codeUrl: "data:application/wasm"
}
