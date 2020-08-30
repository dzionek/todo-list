import React from "react"

import DoneItem from "./DoneItem"
import {Item} from '../utils/typing'


export interface ToDoListProps {
    items: Item[],
    setItems: React.Dispatch<React.SetStateAction<Item[]>>
}


function ToDoList(props: ToDoListProps) {
    return (
        <div id="todo-list">
            {props.items.map(item => {
                return (
                    <DoneItem
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