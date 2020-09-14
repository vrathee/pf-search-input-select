import { useState, useEffect } from 'react';
import { useKeypressReactDispatcher } from './KeypressContext';
import { registerComponent, unRegisterComponent } from './keypressReactReducer';

export function useKeypress(componentName: string) {
    const [id, setId] = useState(null);
    const dispatcher = useKeypressReactDispatcher();
    useEffect(() => {
        const uid = registerComponent(dispatcher,{displayName: componentName});
        setId(uid);
        return () => {
            unRegisterComponent(dispatcher,id);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatcher, componentName]);

    return [id, dispatcher];
}