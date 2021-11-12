import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions(builder => {
  return builder
    .addTextInput({
      path: 'field_deviceId',
      name: 'Field of the device id',
      description: 'Name of the query field that indicates the id of the device to which the data refers.',
      defaultValue: 'headers_hono-device-id',
      category: ['Data options']
    })
    .addTextInput({
      path: 'property_start',
      name: 'Text before property names',
      description: 'Text that precedes the name of the device properties in the query field. For example, if the field of the query that indicates the temperature property is headers_temperature_properties_value then the value in this section must be headers_.',
      defaultValue: 'value_',
      category: ['Data options']
    })
    .addTextInput({
      path: 'property_end',
      name: 'Text after property names',
      description: 'Text that follows the name of the device properties in the query field. For example, if the field of the query that indicates the temperature property is headers_temperature_properties_value, then the value in this section must be _properties.',
      defaultValue: '_properties',
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
      description: 'Name of the event sent by Unity to the panel to obtain the information of a device.',
      defaultValue: 'GetData',
      category: ['Unity options']
    })
    .addTextInput({
      path: 'functionUnityToReceiveData',
      name: 'Unity function that will get the data',
      description: 'Name of the Unity function that receives the data provided by the query. In this function we can make our model change depending on the information received.',
      defaultValue: 'SetValues',
      category: ['Unity options']
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
    .addBooleanSwitch({
      path: 'showSeriesCount',
      name: 'Show series counter',
      defaultValue: false,
    })
    .addRadio({
      path: 'seriesCountSize',
      defaultValue: 'sm',
      name: 'Series counter size',
      settings: {
        options: [
          {
            value: 'sm',
            label: 'Small',
          },
          {
            value: 'md',
            label: 'Medium',
          },
          {
            value: 'lg',
            label: 'Large',
          },
        ],
      },
      showIf: config => config.showSeriesCount,
    });*/
});
