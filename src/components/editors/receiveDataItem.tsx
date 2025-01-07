import React, { ChangeEvent, FocusEvent, useEffect, useState } from 'react';
import { SelectableValue } from '@grafana/data'
import { defaultReceiveData, defaultSRecvDataGrafanaVariable } from 'utils/defaults';
import { ISelect, ReceiveData, ReceiveDataMode, ReceiveDataType, RecvDataGrafanaVariable } from 'utils/types'
import { Field, Input, Select } from '@grafana/ui';
import { enumToSelect } from 'utils/functions';
import { getOptionsVariable } from 'utils/grafana';
import { getTemplateSrv } from '@grafana/runtime';

interface Props {
    value: ReceiveData,
    change: (r: ReceiveData) => void
}

// eslint-disable-next-line react/display-name
export const ReceiveDataItem: React.FC<Props> = ({ value, change }) => {
    if (!value) {
        value = defaultReceiveData;
    }

    const modeOptions: ISelect[] = enumToSelect(ReceiveDataMode)
    const [mode, setMode] = useState<SelectableValue<ReceiveDataMode>>({ label: value.mode, value: value.mode })

    const typeOptions: ISelect[] = enumToSelect(ReceiveDataType)
    const [type, setType] = useState<SelectableValue<ReceiveDataType>>({ label: value.type, value: value.type })

    const OptionsVariable: ISelect[] = getOptionsVariable(getTemplateSrv())
    const [grafanaVar, setGrafanaVar] = useState<SelectableValue<string>>()

    const [nameEvent, setNameEvent] = useState(value.nameEvent)


    const handleOnChangeNameEvent = (event: ChangeEvent<HTMLInputElement>) => {
        setNameEvent(event.currentTarget.value)
    }

    const handleOnBlurNameEvent = (event: FocusEvent<HTMLInputElement>) => {
        const updatedValue = { 
            ...value, 
            nameEvent: event.currentTarget.value 
        }
        change(updatedValue);
    }

    const setDefaultConfigByMode = () => {
        switch (mode.value) {
            default:
                value.config = defaultSRecvDataGrafanaVariable
        }
    }

    useEffect(() => {
        if (grafanaVar !== undefined && grafanaVar.value !== undefined && value.mode === ReceiveDataMode.inGrafanaVariable
            && (value.config as RecvDataGrafanaVariable).varId !== grafanaVar.value
        ) {
            value.config = {
                ...value.config,
                varId: grafanaVar.value
            }
            change(value)
        }
    }, [grafanaVar])

    useEffect(() => {
        if (mode.value !== undefined && mode.value !== value.mode) {
            value.mode = mode.value
            setDefaultConfigByMode()
            change(value)
        }
    }, [mode])

    useEffect(() => {
        if (type.value !== undefined && type.value !== value.type) {
            value.type = type.value
            change(value)
        }
    }, [type])

    useEffect(() => {
        if (value.mode === ReceiveDataMode.inGrafanaVariable && (value.config as RecvDataGrafanaVariable).varId !== undefined) {
            const varOption = OptionsVariable.find((v) => v.value === (value.config as RecvDataGrafanaVariable).varId)
            setGrafanaVar(varOption)
        }
    }, [])


    const grafanaVariable = <Field label="Grafana variable name" required description="">
        <Select
            value={grafanaVar}
            options={OptionsVariable}
            onChange={(v) => setGrafanaVar(v)}
            menuPosition='fixed'
        />
    </Field>

    const getConfigByMode = () => {
        if (value.mode !== undefined && value.mode === ReceiveDataMode.inGrafanaVariable) {
            return grafanaVariable
        } else {
            return <div></div>
        }
    }

    return <div>
        <Field label="Unity name event" required description="">
            <Input value={nameEvent} onChange={handleOnChangeNameEvent} onBlur={handleOnBlurNameEvent}/>
        </Field>
        <Field label="Type" required description="">
            <Select
                value={type}
                options={typeOptions}
                onChange={(v) => setType(v)}
                menuPosition='fixed'
            />
        </Field>
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
}

