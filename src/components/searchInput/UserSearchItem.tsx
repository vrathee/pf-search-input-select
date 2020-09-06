import React, { forwardRef } from 'react';
import { IUser, getMarkedString } from './utils';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';

export interface IProps {
    user: IUser;
    query: string;
    isSelected: boolean,
    isHighlighted: boolean,
    onSelect: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onMouseEnter: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
}

export const UserSearchItem = forwardRef((props: IProps, ref: any) => {
    const { user, query, isSelected, isHighlighted}  = props;
    const trimmedQuery =  query.trim();
    return (
        <li 
            className={`list-item ${isHighlighted ? 'highlighted': ''}`} 
            onMouseEnter={props.onMouseEnter}
            ref={ref}
        >
            <button 
                type="button"
                className={`pf-c-select__menu-item pf-m-description${isSelected ? ' pf-m-selected': ''}`}
                onClick={props.onSelect}
            >
                <div className="pf-c-select__menu-item-main"  dangerouslySetInnerHTML={
                    { __html :getMarkedString(user?.id ?? '',trimmedQuery)}
                } />
                <div className="pf-c-select__menu-item-main"  dangerouslySetInnerHTML={
                    { __html :getMarkedString(user?.name ?? '',trimmedQuery)}
                } />
                {   
                    !isEmpty(trimmedQuery) && filter(user.items, i => includes(i?.toLocaleLowerCase(), trimmedQuery.toLocaleLowerCase()) ).length > 0 && (<>
                    <hr className="pf-c-divider" />
                    <div className="pf-c-select__menu-item-description">
                        "{trimmedQuery}" found in items
                    </div>
                    <hr className="pf-c-divider" />
                    </>)
                }
                <div className="pf-c-select__menu-item-description"  dangerouslySetInnerHTML={
                    { __html :getMarkedString(user?.address ?? '',trimmedQuery)}
                } />
                {isSelected && (
                    <span className="pf-c-select__menu-item-icon">
                    <i className="fas fa-check" aria-hidden="true"></i>
                    </span> 
                )}
            </button>
        </li>
    )
})
