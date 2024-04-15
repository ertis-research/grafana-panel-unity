import { PanelPlugin } from '@grafana/data';
import { UnityPanel } from 'UnityPanel';
//import { UploadFileEditor } from 'UploadFileEditor';
import { SimpleOptions } from './types';

export const plugin = new PanelPlugin<SimpleOptions>(UnityPanel).setPanelOptions(builder => {
  return builder
    .addTextInput({
      path: 'field_deviceId',
      name: 'Field of the id',
      description: 'Name of the query field that indicates the id to which the data refers.',
      defaultValue: 'thingId',
      category: ['Data options']
    })
    .addStringArray({
      path: 'variables_to_send',
      name: 'Variables to send',
      description: 'Variables to be sent together with the temporary data. To specify dashboard variables, precede them with $ (example: $ini_time). You can add other variables using the format NAME:VALUE (example: board_name:test).',
      defaultValue: [],
      category: ['Data options']
    })
    .addStringArray({
      path: 'fields_to_send',
      name: 'Fields to send',
      description: 'List of fields to be sent to the Unity model. If this field is not filled in, all available fields will be sent.',
      defaultValue: [],
      category: ['Data options']
    })
    .addTextInput({
      path: 'variable_deviceId',
      name: 'Grafana dashboard variable of selected device id',
      description: 'Name of the Grafana dashboard variable that stores the id of the selected device. This will allow displaying information about it in other panels.',
      defaultValue: 'deviceId',
      category: ['Dashboard options']
    })
    .addTextInput({
      path: 'messageUnityToGetData',
      name: 'Unity event to get data',
      description: 'Name of the event sent by Unity to the panel to set dashboard variable.',
      defaultValue: 'GetData',
      category: ['Unity options']
    })
    .addBooleanSwitch({
      path: 'useSpecificGameObject',
      name: 'Send data to a specific gameobject',
      description: 'Enable to send the data to a specific Unity gameobject. Disable to send the data of each identifier to a gameobject with the same identifier.',
      defaultValue: true,
      category: ['Unity options']
    })
    .addTextInput({
      path: 'gameObjectUnityToReceiveData',
      name: 'Unity GameObject that will receive the data',
      description: 'Name of the Unity gameobject that receives the data provided by the query. It must contain the receiving function indicated in the following field.',
      defaultValue: '',
      category: ['Unity options'],
      showIf: (config: SimpleOptions) => config.useSpecificGameObject
    })
    .addTextInput({
      path: 'functionUnityToReceiveData',
      name: 'Unity function that will receive the data',
      description: 'Name of the Unity function that receives the data provided by the query. In this function we can make our model change depending on the information received.',
      defaultValue: 'SetValues',
      category: ['Unity options', 'Model']
    })
    .addTextInput({
      path: 'folderUnityBuild',
      name: 'Folder with Unity model',
      description: 'Name of the folder that contains the Unity model files built in WebGL that we want to display. This should be inside the grafana public/unitybuild folder.',
      defaultValue: 'raspberry',
      category: ['Unity options']
    })
    .addTextInput({
      path: 'nameOfFilesUnityBuild',
      name: 'Unity build file names',
      description: 'Name of the files obtained as a result of compiling the Unity model in WebGL. There must be 4 files with the same name and extensions: .data, .framework, .loader and .wasm. They must be contained in the folder specified in the previous field.',
      defaultValue: 'myunityapp',
      category: ['Unity options']
    })
    /*
    .addCustomEditor({
      id: 'uploadfiles',
      path: 'uploadfiles',
      name: 'Files',
      category: ['Unity options'],
      editor: UploadFileEditor
    })
    */
});
