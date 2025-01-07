import { PanelPlugin } from '@grafana/data';
import { Options } from './utils/types';
import { Main } from 'components/main';
import { UnityModelEditor } from 'components/editors/unityModelEditor';
import { defaultReceiveData, defaultSendData, defaultUnityModel } from 'utils/defaults';
import { SendDataEditor } from 'components/editors/sendDataEditor';
import { ReceiveDataEditor } from 'components/editors/receiveDataEditor';

export const plugin = new PanelPlugin<Options>(Main).setPanelOptions(builder => {
  return builder
    .addCustomEditor({
      id: 'unityModel',
      path: 'unityModel',
      name: 'Unity model',
      category: ['Unity model'],
      defaultValue: defaultUnityModel,
      editor: UnityModelEditor
    })
    .addCustomEditor({
      id: 'sendData',
      path: 'sendData',
      name: 'Send data to Unity',
      category: ['Send data to Unity'],
      defaultValue: defaultSendData,
      editor: SendDataEditor
    })
    .addCustomEditor({
      id: 'receiveData',
      path: 'receiveData',
      name: 'Receive data from Unity',
      category: ['Receive data from Unity'],
      defaultValue: defaultReceiveData,
      editor: ReceiveDataEditor
    })
});
