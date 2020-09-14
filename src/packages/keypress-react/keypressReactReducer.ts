import keypress from "keypress.js";
import find from "lodash/find";

export interface IAction<T, P> {
    type: T;
    payload?: Partial<P>;
}

export interface IKeypressItemEvent {
    keyCombo: string
    keyDescription : string[]
}

export interface IComponentDetails  {
    displayName: string;
}
export interface IKeypressComponent extends IComponentDetails {
	uuid: string;
	listener : keypress.Listener;
    events: IKeypressItemEvent[];
    callback: () => void;
}

export interface IKeyPressState {
    [key: string]: IKeypressComponent
}


export type ISActionPayload = IKeypressComponent;

export enum ISActions {
    reset = 'reset',
    registerEvent = 'registerEvent',
    registerComponent = 'registerComponent',
    unregisterComponentEvent = 'unregisterComponentEvent',
    unregisterAllComponentEvents = 'unregisterAllComponentEvents',

}
type ISAction = IAction<ISActions, ISActionPayload>;

export type KeypressReducerDispatchType = (value: ISAction) => void;

export const initialState: IKeyPressState = {};

export function userKeypressReactReducer(state: IKeyPressState, action: ISAction): IKeyPressState {
    switch (action.type) {
        case ISActions.reset: {
            return {};
        }
        case ISActions.registerComponent: {
            const newComponenet = action.payload;
            return { ...state, [newComponenet.uuid]: newComponenet as IKeypressComponent};
        }
        case ISActions.registerEvent: {
            if (!state[action.payload.uuid]) {
                console.error('The id is not registered with the application')
                return state;
            }
            const event = action.payload.events[0];
            const component = state[action.payload.uuid];
            component.listener.simple_combo(event.keyCombo, action.payload.callback);

            const existingEvent = find(component.events, e => e.keyCombo === event.keyCombo);
            if (existingEvent) {
                existingEvent.keyDescription.push(event.keyDescription[0]);
            } else {
                const newEvent  = {
                    keyCombo: event.keyCombo,
                    keyDescription: [event.keyDescription[0]]
                }
                component.events.push(newEvent)
            }

            return { ...state, [component.uuid]: component as IKeypressComponent };
        }
        case ISActions.unregisterComponentEvent: {
            return { ...state };
        }
        case ISActions.unregisterAllComponentEvents: {
            return { ...state };
        }
        default:
            throw new Error();
    }
}

export function registerComponent(dispatch: KeypressReducerDispatchType, componentDetails: IComponentDetails): string {
    const uniqueId = new Date().getTime();
    const newListener = new keypress.Listener();
    dispatch({
        type: ISActions.registerComponent,
        payload: {
            uuid: uniqueId+'',
            displayName: componentDetails.displayName,
            listener: newListener,
            events: []
        }
    });
    return uniqueId+'';
}

export function unRegisterComponent(dispatch: KeypressReducerDispatchType, uid: string) {
    // todo
}

export interface ICompEvent {
    uuid: string;
    keyCombo: string;
    keyDescription: string;
    callback: () => void;
}

export function registerEvent(dispatch: KeypressReducerDispatchType, event: ICompEvent) {
    dispatch({
        type: ISActions.registerEvent,
        payload: {
            uuid: event.uuid,
            events: [
                {
                    keyCombo: event.keyCombo,
                    keyDescription: [event.keyDescription]
                }
            ],
            callback: event.callback
        }
    })
}

export function unRegisterEvent(dispatch: KeypressReducerDispatchType, event: ICompEvent) {
// todo
}

