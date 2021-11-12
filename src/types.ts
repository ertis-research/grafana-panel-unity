type SeriesSize = 'sm' | 'md' | 'lg';

export interface SimpleOptions {
  field_deviceId: string;
  variable_deviceId: string;
  property_start: string;
  property_end: string;
  messageUnityToGetData: string;
  functionUnityToReceiveData: string;
  folderUnityBuild: string;
  nameOfFilesUnityBuild: string;
  showSeriesCount: boolean;
  seriesCountSize: SeriesSize;
}
