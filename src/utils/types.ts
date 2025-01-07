// UNITY FILES
// --------------------------------------------------------
export enum SetUnityModelMode {
  links = "External links",
  publicFolder = "Grafana public folder",
  dragDrop = "Drag and drop (not recommended)"
} 

export interface UnityFiles {
  loaderUrl: string,
  dataUrl: string,
  frameworkUrl: string,
  codeUrl: string
}

export interface UnityModel {
  setFilesMode: SetUnityModelMode;
  unityFiles: UnityFiles;
}

// SEND DATA
// --------------------------------------------------------
export enum SendDataMode {
  sameGameObj = "Send all data to a single GameObject",
  diffGameObj = "Send data to GameObjects by ID column"
}

export interface SendAllData {
  recvGameObj: string;
  idGroupColumn?: string;
}

export interface SendDataById {
  idColumn: string;
}

export interface FilterData {
  dashboardVars: string[];
  columns: string[];
}

export interface SendData {
  mode: SendDataMode;
  unityFunc: string;
  grafanaQuery: string;
  groupBy?: string;
  config: SendAllData | SendDataById;
  filter: FilterData;
}


// RECEIVE DATA
// --------------------------------------------------------
export enum ReceiveDataMode {
  inGrafanaVariable = "Store value in Grafana variable",
//  localStorage = "Local storage",
//  customEvents = "Custom events"
}

export enum ReceiveDataType {
  text = "Text",
  number = "Number"
}

export interface RecvDataGrafanaVariable {
  varId: string;
}

export interface RecvDataLocalStorage {
}

export interface RecvDataCustomEvents {
}

export interface ReceiveData {
  nameEvent: string;
  type: ReceiveDataType;
  mode: ReceiveDataMode;
  config: RecvDataGrafanaVariable | RecvDataLocalStorage | RecvDataCustomEvents;
}


// PANEL OPTIONS
// --------------------------------------------------------
export interface Options {
  unityModel: UnityModel;
  sendData?: SendData;
  receiveData: ReceiveData[]
}


// OTHERS
export interface ISelect {
  label: string,
  value: any
}
