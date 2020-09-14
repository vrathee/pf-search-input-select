import React, { useEffect } from 'react';
import { useKeypress, registerEvent } from '../../packages/keypress-react';

export interface IProps {

}

export const ComponentA = (props: IProps) => {
    const [id, dispatcher] = useKeypress("MyCompA");
    useEffect(()=>{
        if(!dispatcher || !id) return;
        registerEvent(dispatcher, {
            uuid: id,
            keyCombo: "shift s",
            keyDescription: "Shift s in comp A",
            callback: () => console.log("Event triggered in A")
        })
    },[dispatcher, id])
    return (<div>A</div>)
}
