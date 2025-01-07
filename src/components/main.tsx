import React, { useEffect, useState } from 'react'
import { PanelProps } from '@grafana/data'
import { Options, ReceiveData, ReceiveDataMode, RecvDataGrafanaVariable, SendAllData, SendDataById, SendDataMode } from 'utils/types'
import Unity, { UnityContext } from 'react-unity-webgl'
import { getListGroupId, getUrlIfBase64 } from 'utils/functions';
import { locationService } from '@grafana/runtime';
import { getAllData, groupBy, setGrafanaVariable } from 'utils/grafana';


interface Props extends PanelProps<Options> { }


export const Main: React.FC<Props> = ({ options, data, width, height }) => {

  const [unityContext, setUnityContext] = useState<UnityContext>()
  const [isLoaded, setIsLoaded] = useState(false)
  const isEditing = locationService.getSearchObject().editPanel !== undefined;

  const createUnityContext = () => {
    setUnityContext(new UnityContext({
      loaderUrl: getUrlIfBase64(options.unityModel, 'loaderUrl'),
      dataUrl: getUrlIfBase64(options.unityModel, 'dataUrl'),
      frameworkUrl: getUrlIfBase64(options.unityModel, 'frameworkUrl'),
      codeUrl: getUrlIfBase64(options.unityModel, 'codeUrl')
    }))
  }

  const setListenersToReceiveData = () => {
    if (unityContext && options.receiveData && options.receiveData.length > 0) {
      options.receiveData
        .filter((recv: ReceiveData) => recv.nameEvent !== undefined && recv.nameEvent.trim() !== '')
        .forEach((recv: ReceiveData) => {
          switch (recv.mode) {
            case ReceiveDataMode.inGrafanaVariable:
              const varName = (recv.config as RecvDataGrafanaVariable).varId
              if (varName !== undefined && varName.trim() !== '') {
                unityContext.on(recv.nameEvent, (e) => setGrafanaVariable(locationService, varName, e))
              }
              break
          }
        })
    }
  }

  const sendData = (unityContext: UnityContext, data: any) => {
    if(options.sendData) {
      if (options.sendData.mode === SendDataMode.diffGameObj) { 
        const config = options.sendData.config as SendDataById
        const func = options.sendData.unityFunc
        let groupId = [config.idColumn]
        if(options.sendData.groupBy) { groupId = {...groupId, ...getListGroupId(options.sendData.groupBy)} }
        const dataGroup = groupBy(data, groupId)
        Object.keys(dataGroup).forEach((id: any) => {
          unityContext.send(id, func, JSON.stringify({ series: dataGroup[id] }))
        })
  
      } else {
        const config = options.sendData.config as SendAllData
        if(options.sendData.groupBy) { data = groupBy(data, getListGroupId(options.sendData.groupBy)) }
        unityContext.send(config.recvGameObj, options.sendData.unityFunc, JSON.stringify({series: data}))
  
      }
    }
  }

  useEffect(() => {
    if (!isEditing) {
      createUnityContext()
    }
  }, [options.unityModel.unityFiles])

  useEffect(() => {
    if (unityContext !== undefined) {
      setListenersToReceiveData()
      unityContext.on("loaded", () => setIsLoaded(true))
    }
  }, [unityContext])

  useEffect(() => {
    if (unityContext !== undefined && isLoaded && options.sendData) {
      sendData(unityContext, getAllData(data))
      console.log("Todo enviado")
    }
  }, [data, options, isLoaded])

  const getUnityComponent = () => {
    if (unityContext !== undefined && !isEditing) {
      return <div tabIndex={1}>
        <Unity style={{ width: width, height: height }} unityContext={unityContext} tabIndex={1} />
      </div>
    } else {
      return <div>No preview is available. Save and exit edit mode to view the Unity model.</div>
    }
  }

  return getUnityComponent()

};
