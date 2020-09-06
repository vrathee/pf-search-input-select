import '@patternfly/patternfly/patternfly.css';
import '@patternfly/patternfly/components/Select/select.css';

import React, { useReducer, useRef, useEffect } from 'react';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';

import { UserSearchItem } from './UserSearchItem';
import { initialState, userSearchReducer, ISActions } from './UserSearchInputReducer';
import { IUser, KeyCodes, scrollToLIIfNeeded } from './utils';
import { useDebounce } from '../useDebounce';
import { findIndex } from 'lodash';
import map from 'lodash/map';

/**
 * Using this UX design library to add proper styling
 * https://www.patternfly.org/v4/documentation/core/components/select
 * 
 * */
export interface IProps {
    users: IUser[];
    onSelect: (value: IUser) => void;
    placeholder?: string;
}

export function UserSearchInput(props: IProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const ulRef = useRef<HTMLUListElement>(null);
    const [state, dispatch] = useReducer(userSearchReducer, {
        ...initialState,
        originalUsers: props.users,
        filteredUsers: props.users
    });
    useDebounce(()=>{
        const lowerCaseQ = state.query?.trim()?.toLocaleLowerCase();
        const filteredList = filter(state.originalUsers, u => {
            return includes(u.name?.toLocaleLowerCase(), lowerCaseQ) ||
                includes(u.id?.toLocaleLowerCase(), lowerCaseQ) ||
                includes(u.address?.toLocaleLowerCase(), lowerCaseQ) ||
                (
                    !isEmpty(filter(u.items, i => includes(i?.toLocaleLowerCase(), lowerCaseQ)))
                );
        })
        dispatch({
            type: ISActions.filteredListChange,
            payload: { filteredUsers: filteredList }
        })
    },[state.query], 500)

    useEffect(()=>{
        props.onSelect?.(props.users[state.selectedIndex] ?? {})
    },[props.onSelect, props.users, state.selectedIndex])

    useEffect(()=>{
        scrollToLIIfNeeded(ulRef.current, state.highlightedIndex);
    },[state.highlightedIndex])

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: ISActions.queryChange,
            payload: { query: e.target.value }
        })
    }

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.keyCode) {
            case KeyCodes.down: {
                dispatch({ type: ISActions.downArrowKeyPressed })
                break;
            }
            case KeyCodes.up: {
                dispatch({ type: ISActions.upArrowKeyPressed })
                break;
            }
            case KeyCodes.escape: {
                if (state.isOpen) {
                    dispatch({
                        type: ISActions.closeDropdown
                    })
                }
                break;
            }
            case KeyCodes.enter: {
                const sIndex  = findIndex(props.users, u => u.id === state.filteredUsers?.[state.highlightedIndex]?.id)
                dispatch({
                    type: ISActions.enterKeyPressed,
                    payload: { index: sIndex }
                })
                break;
            }
        }
    }
    const onClear = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        dispatch({
            type: ISActions.clearInput,
        })
        props.onSelect?.({})
        inputRef.current?.focus()
    }
    const onToggleDropdown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        dispatch({
            type: ISActions.toggleDropdown,
        })
        inputRef.current?.focus()
    }

    // List Item related
    const onListItemMouseEnter = (index: number) => (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        dispatch({
            type: ISActions.hoveredItem,
            payload: { index }
        })
    }
    // List Item related
    const onItemClick = (index: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const sIndex  = findIndex(props.users, u => u.id === state.filteredUsers?.[index]?.id)
        dispatch({
            type: ISActions.itemClicked,
            payload: { index: sIndex }
        })
    }

    return (<div className={`pf-c-select${state.isOpen ? ' pf-m-expanded' : ''}`} >
        <div className="pf-c-select__toggle pf-m-typeahead">
            <div className="pf-c-select__toggle-wrapper">
                <span className="pf-c-search-input__icon">
                    <i className="fas fa-search fa-fw" aria-hidden="true"></i>
                </span>
                <input className="pf-c-form-control pf-c-select__toggle-typeahead no-outline"
                    ref={inputRef}
                    type="text"
                    aria-label={props.placeholder ?? 'Type to search'}
                    placeholder={props.placeholder ?? 'Type to search'}
                    value={state.query}
                    onChange={onInputChange}
                    onKeyDown={onInputKeyDown}
                />
                {!isEmpty(state.query) && <button
                    className="pf-c-button pf-m-plain pf-c-select__toggle-clear no-outline"
                    type="button" aria-label="Clear input"
                    onClick={onClear}
                >
                    <i className="fas fa-times-circle" aria-hidden="true"></i>
                </button>}
                <button className="pf-c-button pf-m-plain pf-c-select__toggle-button no-outline" type="button"
                    aria-haspopup="true" aria-expanded="true" aria-label="Toggle"
                    onClick={onToggleDropdown}
                >
                    <i className="fas fa-caret-down pf-c-select__toggle-arrow" aria-hidden="true"></i>
                </button>
            </div>
        </div>
        <ul
            className="pf-c-select__menu pf-m-wrap list-item-wrapper"
            aria-labelledby="select-single-typeahead-label"
            hidden={!state.isOpen}
            ref={ulRef}
        >
            {map(state.filteredUsers , (u, index) => (
                <UserSearchItem
                    key={u.id}
                    user={u}
                    query={state.query}
                    isSelected={u.id === props.users?.[state.selectedIndex]?.id}
                    isHighlighted={state.highlightedIndex === index}
                    onSelect={onItemClick(index)}
                    onMouseEnter={onListItemMouseEnter(index)}
                />
            ))}
            {isEmpty(state.filteredUsers) && <span>No Results</span>}
        </ul>
    </div>
    )
}
