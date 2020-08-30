import React from "react"

import ToDoItem from "./ToDoItem"
import {Item} from './SuperList'


export interface ToDoListProps {
    items: Item[],
    setItems: React.Dispatch<React.SetStateAction<Item[]>>
}


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