import React, { useEffect, useState } from 'react';
import { useKeypress, registerEvent } from '../../packages/keypress-react';

export interface IProps {

}

export const ComponentA = (props: IProps) => {
    const [id, dispatcher] = useKeypress("MyCompA");
    const [toggleBackground, setToggleBackground] = useState(false);
    useEffect(()=>{
        if(!dispatcher || !id) return;
        registerEvent(dispatcher, {
            uuid: id,
            keyCombo: "shift s",
            keyDescription: "Set Background Teal",
            callback: () => {console.log("Event triggered in A"); setToggleBackground(!toggleBackground)}
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id])
    return (<div className={`comp-a ${toggleBackground ? 'toggle-a' : ''}`}>This is component A</div>)
}
