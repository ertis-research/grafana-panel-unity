import { ReceiveData, ReceiveDataMode, ReceiveDataType, RecvDataGrafanaVariable, SendAllData, SendData, SendDataById, SendDataMode, SetUnityModelMode, UnityModel } from "./types";

export const defaultUnityModel: UnityModel = {
    setFilesMode: SetUnityModelMode.links,
    unityFiles: {
        loaderUrl: '',
        dataUrl: '',
        frameworkUrl: '',
        codeUrl: ''
    }
}

export const defaultSendAllData: SendAllData = {
    recvGameObj: ''
}

export const defaultSendDataById: SendDataById = { 
    idColumn: ''
 }

export const defaultSendData: SendData = {
    mode: SendDataMode.sameGameObj,
    unityFunc: '',
    grafanaQuery: '',
    config: defaultSendAllData,
    filter: {
        dashboardVars: [],
        columns: []
    }
}

export const defaultSRecvDataGrafanaVariable: RecvDataGrafanaVariable = { 
    varId: ''
}

export const defaultReceiveData: ReceiveData = {
    nameEvent: '',
    type: ReceiveDataType.text,
    mode: ReceiveDataMode.inGrafanaVariable,
    config: defaultSRecvDataGrafanaVariable
}
