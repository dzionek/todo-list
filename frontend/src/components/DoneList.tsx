import React from "react"

import DoneItem from "./DoneItem"
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
                    <DoneItem
                        key={item.id}
                        id={item.id}
                        description={item.description}
                        createdAt={item.created_at}
                        isFinished={item.is_finished}
                        setItems={props.setItems}
                    />
                )
            })}
        </div>
    )
}

export default ToDoList