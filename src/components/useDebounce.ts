import debounce from 'lodash/debounce';
import { useEffect } from 'react';

// importing from lodash was showing a import cost of 71K
interface DebounceSettings {
    leading?: boolean;
    maxWait?: number;
    trailing?: boolean;
}

// Takes a callback that is called after a debounce delay based on the dependencies array
// Its just a wrapper over useEffect and debounce function which cancels previous callback each time
export function useDebounce(
    callback: () => void,
    dependencies: ReadonlyArray<any>,
    wait: number = 0,
    options: DebounceSettings = {}
) {
    useEffect(() => {
        const handler = debounce(
            () => {
                callback();
            },
            wait,
            options
        );
        handler();
        // Clears the previous callback
        return () => {
            handler.cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wait, ...dependencies]);
}
