import React, { useEffect, useState } from 'react';
import { useKeypress, registerEvent } from '../../packages/keypress-react';

export interface IProps {

}

export const ComponentB = (props: IProps) => {
    const [id, dispatcher] = useKeypress("MyCompB");
    const [toggleBackground, setToggleBackground] = useState(false);
    useEffect(()=>{
        if(!dispatcher || !id) return;
        registerEvent(dispatcher, {
            uuid: id,
            keyCombo: "shift s",
            keyDescription: "Set Background Red",
            callback: () => {console.log("Event triggered in B"); setToggleBackground(!toggleBackground)}
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id])
    return (<div className={`comp-b ${toggleBackground ? 'toggle-b' : ''}`}>This is component A</div>)}
