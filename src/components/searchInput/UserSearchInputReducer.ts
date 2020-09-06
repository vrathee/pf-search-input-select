import { IUser } from "./utils";

export interface IAction<T, P> {
    type: T;
    payload?: Partial<P>;
}

export interface ISearchInputState {
    originalUsers: IUser[],
    filteredUsers: IUser[],
    query: string;
    isOpen: boolean;
    highlightedIndex: number;
    selectedIndex: number;
}

type ISActionPayload = ISearchInputState & { index: number }

export enum ISActions {
    reset = 'reset',
    upArrowKeyPressed = 'upArrowKeyPressed',
    downArrowKeyPressed = 'downArrowKeyPressed',
    escKeyPressed = 'escKeyPressed',
    enterKeyPressed = 'enterKeyPressed',
    itemClicked = 'itemClicked',
    hoveredItem = 'hoveredItem',
    blurredDropdown = 'blurredDropdown',
    queryChange = 'queryChange',
    filteredListChange = 'filteredListChange',
    openDropdown = 'openDropdown',
    closeDropdown ='closeDropdown',
    toggleDropdown =  'toggleDropdown',
    highlightFirst  = 'highlightFirst',
    highlightLast  = 'highlightLast',
    clearInput = 'clearInput'

}
type ISAction = IAction<ISActions, ISActionPayload>;

export const initialState: ISearchInputState = { originalUsers: [], filteredUsers: [], query: '', isOpen: false, highlightedIndex: -1, selectedIndex: -1 };

export function userSearchReducer(state: ISearchInputState, action: ISAction): ISearchInputState {
    switch (action.type) {
        case ISActions.reset: {
            return { ...initialState };
        }
        case ISActions.upArrowKeyPressed: {
            const newHIndex = (state.highlightedIndex === -1 || state.highlightedIndex === 0) ? state.filteredUsers.length - 1 : state.highlightedIndex - 1;
            return { ...state, highlightedIndex: newHIndex, isOpen: true };
        }
        case ISActions.downArrowKeyPressed: {
            const newHIndex = (state.highlightedIndex === -1 || state.highlightedIndex === (state.filteredUsers.length - 1)) ? 0 : state.highlightedIndex + 1;
            return { ...state, highlightedIndex: newHIndex, isOpen: true };
        }
        case ISActions.highlightFirst: {
            return { ...state, highlightedIndex: 0 };
        }
        case ISActions.highlightLast: {
            return { ...state, highlightedIndex: state.filteredUsers.length - 1 };
        }
        case ISActions.escKeyPressed: {
            if (!state.isOpen) return state;
            return { ...state, isOpen: false };
        }
        case ISActions.hoveredItem: {
            const newHIndex = action?.payload?.index;
            if (newHIndex === undefined || newHIndex === state.highlightedIndex) return state;
            return { ...state, highlightedIndex: newHIndex };
        }
        case ISActions.itemClicked:
        case ISActions.enterKeyPressed: {
            const newSIndex = action?.payload?.index;
            if (newSIndex === undefined || newSIndex === state.selectedIndex) return state;
            return { ...state, selectedIndex: newSIndex, isOpen: false, highlightedIndex: -1, query: state.filteredUsers[newSIndex]?.name ?? '' };
        }
        case ISActions.queryChange: {
            if (state.query === action.payload?.query) return state;
            return { ...state, query: action.payload?.query ?? '', isOpen: true }
        }
        case ISActions.clearInput: {
            if (state.query === action.payload?.query) return state;
            return { ...state, query: '', selectedIndex: -1 }
        }
        case ISActions.filteredListChange: {
            if (state.filteredUsers === action.payload?.filteredUsers) return state;
            return { ...state, filteredUsers: action.payload?.filteredUsers ?? [] }
        }
        case ISActions.openDropdown: {
            if (state.isOpen) return state;
            return { ...state, isOpen: true, highlightedIndex: -1 };
        }
        case ISActions.closeDropdown: {
            if (!state.isOpen) return state;
            return { ...state, isOpen: false , highlightedIndex: -1};
        }
        case ISActions.toggleDropdown: {
            return { ...state, isOpen: !state.isOpen , highlightedIndex: -1};
        }
        default:
            throw new Error();
    }
}

