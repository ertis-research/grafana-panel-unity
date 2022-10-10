type SeriesSize = 'sm' | 'md' | 'lg';

export interface SimpleOptions {
  field_deviceId: string;
  variable_deviceId: string;
  messageUnityToGetData: string;
  useSpecificGameObject: boolean;
  gameObjectUnityToReceiveData: string;
  functionUnityToReceiveData: string;
  folderUnityBuild: string;
  nameOfFilesUnityBuild: string;
  showSeriesCount: boolean;
  seriesCountSize: SeriesSize;
  variables_to_send: string[];
  fields_to_send: string[];
}
