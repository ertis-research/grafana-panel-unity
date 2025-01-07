import React, { useCallback } from 'react';
import { StandardEditorProps } from '@grafana/data'
import { defaultReceiveData } from 'utils/defaults';
import { ReceiveData } from 'utils/types'
import { Button, Collapse } from '@grafana/ui';
import { ReceiveDataItem } from './receiveDataItem';

interface Props extends StandardEditorProps<ReceiveData[]> { }

export const ReceiveDataEditor: React.FC<Props> = ({ item, value, onChange }) => {
    if (!value || !value.length) {
        value = [];
    }

    const addElement = (newElement: ReceiveData) => {
        const updated = [...value, newElement]
        onChange(updated)
    }

    const updateElement = useCallback((idx: number, elemUpdated: ReceiveData) => {
        const updated = [...value]
        updated[idx] = elemUpdated
        onChange(updated)
    }, [])

    const deleteElement = (idx: number) => {
        const updated = [...value]
        updated.splice(idx, 1)
        onChange(updated)
    }

    const list = value.map((element: ReceiveData, idx: number) => {
        return <div key={element.nameEvent}>
            <Collapse label={"Event " + (idx+1)} collapsible={false} isOpen={true}>
                <ReceiveDataItem value={element} change={(e: ReceiveData) => updateElement(idx, e)} />
                <div style={{ width: '100%', justifyContent: 'right', display: 'flex'}}>
                    <Button variant='destructive' onClick={() => deleteElement(idx)}>Delete event</Button>
                </div>
            </Collapse>
        </div>
    })

    return (<div>
        {list}
        <Button onClick={() => addElement(defaultReceiveData)}>Add new event</Button>
    </div>)
}
