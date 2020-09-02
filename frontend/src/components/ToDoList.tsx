import React from "react"

import ToDoItem from "./ToDoItem"
import {ItemsFetcherChildProps as ToDoListProps} from '../utils/typing'


/**
 * The component with the list of items that have not yet been done.
 */
function ToDoList(props: ToDoListProps) {
    return (
        <div id="todo-list">
            {props.items.map(item => {
                return (
                    <ToDoItem
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        description={item.description}
                        createdAt={item.created_at}
                        lastModified={item.last_modified}
                        isFinished={item.is_finished}
                        color={item.color}
                        setItems={props.setItems}
                    />
                )
            })}
        </div>
    )
}

export default ToDoList