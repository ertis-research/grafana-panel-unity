import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { SelectableValue, StandardEditorProps } from "@grafana/data";
import { Field, Select, Input, FileDropzone, FileListItem } from '@grafana/ui';
import { defaultUnityModel } from 'utils/defaults';
import { ISelect, SetUnityModelMode, UnityFiles, UnityModel } from 'utils/types';
import { arrayBufferToBase64, enumToSelect, getObjOptions } from 'utils/functions';
import { mimetypes, NamesUnityModel } from 'utils/consts';

interface Props extends StandardEditorProps<UnityModel> { }

export const UnityModelEditor: React.FC<Props> = ({ item, value, onChange }) => {
    if (!value) {
        value = defaultUnityModel;
    }

    const divRef = useRef<HTMLDivElement | null>(null);
    const modeOptions: ISelect[] = enumToSelect(SetUnityModelMode)

    const [mode, setMode] = useState<SelectableValue<SetUnityModelMode>>({ label: value.setFilesMode, value: value.setFilesMode })

    const handleOnChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        if (value.unityFiles) {
            value.unityFiles[event.currentTarget.name as keyof UnityFiles] = event.target.value;
            onChange(value)
        }
    }

    const handleOnFileUpload = (result: string | ArrayBuffer | null, key: string) => {
        if (result instanceof ArrayBuffer) {
            value.unityFiles[key as keyof UnityFiles] = arrayBufferToBase64(result);
            onChange(value)
        }
    }

    const handleRemoveFile = (name: string) => {
        value.unityFiles[name as keyof UnityFiles] = ""
        onChange(value)
    }

    const clearFields = () => {
        value.unityFiles = defaultUnityModel.unityFiles
        onChange(value)
    }

    const deleteSizeInfo = () => {
        if (divRef.current) {
            // Buscamos todos los elementos span dentro del div y verificamos si su contenido es '0 B'
            const spans = divRef.current.querySelectorAll('span');
            spans.forEach((span: any) => {
                if (span.innerHTML === '0 B') {
                    span.remove();
                }
            });
        }
    }

    const getFileItemIfAny = (name: NamesUnityModel, fileName: string) => {
        const file = value.unityFiles[name as keyof UnityFiles]
        if (file !== undefined && file.length > 0) {
            //const blob: any = new Blob([file]); //
            return <FileListItem file={{ file: new File([], fileName), id: fileName, error: null }}
                removeFile={() => handleRemoveFile(name)} />
        }
        return undefined
    }

    const FileDropComponent = ({ name, suffix }: { name: NamesUnityModel, suffix: string }) => {
        return <Field label={suffix} >
            <div>
                <FileDropzone readAs='readAsArrayBuffer' options={getObjOptions(mimetypes[name], suffix)} onLoad={(e) => handleOnFileUpload(e, name)} fileListRenderer={() => { }} />
                {getFileItemIfAny(name, suffix)}
            </div>
        </Field>
    }

    const InputComponent = ({ name, suffix }: { name: NamesUnityModel, suffix: string }) => {
        let val: string = value.unityFiles[name as keyof UnityFiles]
        return <Field label={suffix}>
            <Input name={name} value={val} required onChange={handleOnChangeInput} />
        </Field>
    }

    const uploadFileMode = <div ref={divRef}>
        <FileDropComponent name="dataUrl" suffix=".data" />
        <FileDropComponent name="frameworkUrl" suffix=".framework.js" />
        <FileDropComponent name="loaderUrl" suffix=".loader.js" />
        <FileDropComponent name="codeUrl" suffix=".wasm" />
    </div>

    const setInputMode = <div>
        <InputComponent name="dataUrl" suffix=".data" />
        <InputComponent name="frameworkUrl" suffix=".framework.js" />
        <InputComponent name="loaderUrl" suffix=".loader.js" />
        <InputComponent name="codeUrl" suffix=".wasm" />
    </div>

    useEffect(() => {
        if (mode.value && mode.value !== value.setFilesMode) {
            value.setFilesMode = mode.value
            clearFields()
            onChange(value)
        }
    }, [mode])

    useEffect(() => {
        deleteSizeInfo()
    }, [getFileItemIfAny])
    


    const getConfigByMode = () => {
        switch (mode.value) {
            case SetUnityModelMode.publicFolder:
                return setInputMode
            case SetUnityModelMode.dragDrop:
                return uploadFileMode
            default:
                return setInputMode
        }
    }


    return (
        <div>
            <Field label="Mode" required description="">
                <Select
                    value={mode}
                    options={modeOptions}
                    onChange={(v) => setMode(v)}
                    menuPosition='fixed'
                />
            </Field>
            {getConfigByMode()}
        </div>

    )
}
