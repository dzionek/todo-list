/**
 * Most commonly used types for TypeScript.
 */

import {Dispatch, SetStateAction} from "react";


/** The color of an item. */
export type Color = "blue" | "green" | "yellow" | "red"

/** The filter informing what items should be displayed. */
export type ItemsFilterType = "all" | Color

/** The type of animation of an item. */
export type Animation = "mount" | "unmount"

/** Item data coming from the REST API. */
export interface Item {
    id: number,
    name: string,
    description: string,
    created_at: string,
    last_modified: string,
    is_finished: boolean,
    color: Color
}

/** The Props used by most children of ItemsFetcher component. */
export interface ItemsFetcherChildProps {
    items: Item[]
    setItems: Dispatch<SetStateAction<Item[]>>
}

/** The props of ToDoItem and DoneItem components. */
export interface ItemProps {
    id: number,
    name: string,
    description: string,
    createdAt: string,
    lastModified: string,
    isFinished: boolean,
    color: Color,
    setItems: Dispatch<SetStateAction<Item[]>>
}