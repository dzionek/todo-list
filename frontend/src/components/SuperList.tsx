import React, {Dispatch, SetStateAction} from "react"

import ToDoList from './ToDoList'
import DoneList from './DoneList'
import {Item} from "../utils/typing";


interface SuperListProps {
    items: Item[]
    setItems: Dispatch<SetStateAction<Item[]>>
}


function SuperList(props: SuperListProps) {
    const sortByLastModified = (items: Item[]) => {
        return items.sort((a, b) => {
            const aDate = new Date(a.last_modified)
            const bDate = new Date(b.last_modified)
            return bDate.valueOf() - aDate.valueOf()
        })
    }

    const getCurrentItems = () => {
        return sortByLastModified(props.items.filter(item => !item.is_finished))
    }

    const getDoneItems = () => {
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