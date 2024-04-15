import React from 'react'
import { StandardEditorProps } from "@grafana/data";
import { Field, FileUpload, VerticalGroup  } from '@grafana/ui';

interface Props extends StandardEditorProps<{name: string, value: string}> {}

export const UploadFileEditor: React.FC<Props> = ({ value: parameter, onChange }) => {
    if (!parameter) {
        parameter = {name: "PAss", value: ""};
    }
    
    //const saveFile = () => {

    //}
    
    return(
        <VerticalGroup>
            <Field label=".data" >
                <FileUpload onFileUpload={({ currentTarget }) => console.log('file', currentTarget?.files && currentTarget.files[0])}/>
            </Field>
            <Field label=".framework.js" >
                <FileUpload onFileUpload={({ currentTarget }) => console.log('file', currentTarget?.files && currentTarget.files[0])}/>
            </Field>
            <Field label=".loader.js" >
                <FileUpload onFileUpload={({ currentTarget }) => console.log('file', currentTarget?.files && currentTarget.files[0])}/>
            </Field>
            <Field label=".wasm" >
                <FileUpload onFileUpload={({ currentTarget }) => console.log('file', currentTarget?.files && currentTarget.files[0])}/>
            </Field>
        </VerticalGroup>
        
    )
}
