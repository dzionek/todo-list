import React from "react"

import ToDoList from './ToDoList'
import DoneList from './DoneList'
import {Item, ItemsFetcherChildProps as SuperListProps} from "../utils/typing";

/**
 * The component containing the two lists - current items and done items.
 */
function SuperList(props: SuperListProps): JSX.Element {
    /**
     * Sort the given items by the date of the last modification.
     * The file edited lately has precedence over the one edited before.
     * @param items  The items fetched from API.
     */
    const sortByLastModified = (items: Item[]): Item[] => {
        return items.sort((a, b) => {
            const aDate = new Date(a.last_modified)
            const bDate = new Date(b.last_modified)
            return bDate.valueOf() - aDate.valueOf()
        })
    }

    /**
     * Get the array of items that have not yet been done.
     */
    const getCurrentItems = (): Item[] => {
        return sortByLastModified(props.items.filter(item => !item.is_finished))
    }

    /**
     * Get the array of items that have already been done.
     */
    const getDoneItems = (): Item[] => {
        return sortByLastModified(props.items.filter(item => item.is_finished))
    }

    return (
        <div className="row" id="super-list">
            <div className="col-sm-6">
                <div className="tasks-title rounded-pill">
                    <h5>Current tasks</h5>
                </div>
                <ToDoList
                    items={getCurrentItems()}
                    setItems={props.setItems}
                />
            </div>
            <div className="col-sm-6">
                <div className="tasks-title rounded-pill">
                    <h5>Done tasks</h5>
                </div>
                <DoneList
                    items={getDoneItems()}
                    setItems={props.setItems}
                />
            </div>
        </div>
    )
}

export default SuperList