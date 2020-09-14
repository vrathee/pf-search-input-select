import React, { useEffect } from 'react';
import { useKeypress, registerEvent } from '../../packages/keypress-react';

export interface IProps {

}

export const ComponentB = (props: IProps) => {
    const [id, dispatcher] = useKeypress("MyCompB");
    useEffect(()=>{
        if(!dispatcher || !id) return;
        registerEvent(dispatcher, {
            uuid: id,
            keyCombo: "shift s",
            keyDescription: "Shift s in comp B",
            callback: () => console.log("Event triggered in B")
        })
    },[dispatcher, id])
    return (<div>B</div>)
}
