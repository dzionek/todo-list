import React, {useState} from "react"

import ToDoList from './ToDoList'
import DoneList from './DoneList'
import ItemsFilter from "./ItemsFilter";
import {Item, ItemsFetcherChildProps as SuperListProps, ItemsFilterType} from "../utils/typing";

/**
 * The component containing the two lists - current items and done items.
 */
function SuperList(props: SuperListProps): JSX.Element {
    const [currentItemsFilter, setCurrentItemsFilter] = useState<ItemsFilterType>("all")
    const [doneItemsFilter, setDoneItemsFilter] = useState<ItemsFilterType>("all")

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
     * Get the array of items that have not yet been done filtered by their color.
     */
    const getCurrentItems = (): Item[] => {
        let currentItems = props.items.filter(item => !item.is_finished)

        if (currentItemsFilter !== "all") {
            currentItems = currentItems.filter(item => item.color === currentItemsFilter)
        }

        return sortByLastModified(currentItems)
    }

    /**
     * Get the array of items that have already been done filtered by their color.
     */
    const getDoneItems = (): Item[] => {
        let doneItems = props.items.filter(item => item.is_finished)

        if (doneItemsFilter !== "all") {
            doneItems = doneItems.filter(item => item.color === doneItemsFilter)
        }

        return sortByLastModified(doneItems)
    }

    return (
        <div className="row" id="super-list">
            <div className="col-sm-6">
                <div className="tasks-title rounded-pill">
                    <h5>Current tasks</h5>
                </div>
                <ItemsFilter
                    id="todo-filter"
                    setItemsFilter={setCurrentItemsFilter}
                />
                <ToDoList
                    items={getCurrentItems()}
                    setItems={props.setItems}
                />
            </div>
            <div className="col-sm-6">
                <div className="tasks-title rounded-pill">
                    <h5>Done tasks</h5>
                </div>
                <ItemsFilter
                    id="done-filter"
                    setItemsFilter={setDoneItemsFilter}
                />
                <DoneList
                    items={getDoneItems()}
                    setItems={props.setItems}
                />
            </div>
        </div>
    )
}

export default SuperList