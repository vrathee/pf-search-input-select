import React from 'react';
import { useKeypressReactState, } from '../../packages/keypress-react';

export interface IProps {}

export const DisplayState = (props: IProps) => {
    const state = useKeypressReactState();
    return (<div>Display  here: {console.log(state)}</div>)
}
