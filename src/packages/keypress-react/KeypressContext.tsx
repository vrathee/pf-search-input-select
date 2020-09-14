import React, { useContext, useReducer } from 'react';

import {userKeypressReactReducer, initialState, KeypressReducerDispatchType} from './keypressReactReducer';

const initialDispatchContext: KeypressReducerDispatchType = null;

export const KeypressStateContext = React.createContext(initialState);
export const KeypressdispatchContext = React.createContext(initialDispatchContext);

export const useKeypressReactState = () => useContext(KeypressStateContext);
export const useKeypressReactDispatcher = () => useContext(KeypressdispatchContext);

export function KeypressReactContextProvider({ children }) {
    const [keypressState, dispatch] = useReducer(userKeypressReactReducer, initialState);
    return (
        <KeypressStateContext.Provider value={keypressState}>
            <KeypressdispatchContext.Provider value={dispatch}>{children}</KeypressdispatchContext.Provider>
        </KeypressStateContext.Provider>
    );
}