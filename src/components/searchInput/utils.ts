import isEmpty from "lodash/isEmpty";

export type IItem = string
export interface IUser {
    id?: string;
    name?: string;
    items?: IItem[];
    address?: string;
    pincode?: string;
}

export function getMarkedString(input: string, query: string): string {
    if (isEmpty(query)) return input;
    return input.replace(new RegExp(query, "gi"), (match) => `<mark class="pf-c-select__menu-item--match">${match}</mark>`)
}

export enum KeyCodes {
    up = 38,
    down = 40,
    enter = 13,
    escape = 27
}

export function isLIElementNotInViewOfUL(liRect: DOMRect, ulRect: DOMRect) {
    if (!liRect || !ulRect) {
        return false;
    }
    return (liRect.top < ulRect.top || liRect.bottom > ulRect.bottom);
}

function getScrollToTop(liRect: DOMRect, ulRect: DOMRect, alreadyScrolled: number) {
    let top;
    if  (liRect.top < ulRect.top) {
        console.log('already scrolled', alreadyScrolled)
        console.log('ul top: ', ulRect.top)
        console.log('li top: ', liRect.top)
        top =  alreadyScrolled-(ulRect.top-liRect.top);
    } else {
        top =  (liRect.bottom-ulRect.bottom) + alreadyScrolled;
    }
    return top;
}

export function scrollToLIIfNeeded(ulRef: HTMLUListElement | null, highlightedIndex: number) {
    if (!ulRef) {
        return false;
    }
    const liRef = ulRef.children?.[highlightedIndex];
    if (!liRef ) {
        return false;
    }
    const liRect = liRef.getBoundingClientRect();
    const ulRect = ulRef.getBoundingClientRect();
    if (!isLIElementNotInViewOfUL(liRect,ulRect)) return;
    // Bring new element to top
    const top = getScrollToTop(liRect,ulRect, ulRef.scrollTop);
    try {
        ulRef?.scrollTo({
            top,
            behavior: 'smooth',
        });
    } catch (e) {
        ulRef?.scrollTo(0, top);
    }
}

