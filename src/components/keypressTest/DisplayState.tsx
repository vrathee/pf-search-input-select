import React from 'react';
import { useKeypressReactState, } from '../../packages/keypress-react';
import map from 'lodash/map';

export interface IProps { }

export const DisplayState = (props: IProps) => {
    const state = useKeypressReactState();
    return (<div>
        <h2>Registered Event Details: {console.log(state)}</h2>
        {map(state, s =>
            (<div key={s.uuid} className="component-events">
                <h3>{s.displayName}</h3>
                <ul>{map(s.events, (ev, index) => (
                    <li key={index}><strong>{ev.keyCombo}</strong>: {ev.keyDescription[0]}</li>
                ))}
                </ul>
            </div>)
        )}
    </div>)
}
