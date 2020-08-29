import React, {useEffect} from "react"
import axios from "axios"

import {Item} from './SuperList'


interface ToDoItemProps {
    id: number,
    description: string,
    createdAt: string
    isFinished: boolean,
    setItems: React.Dispatch<React.SetStateAction<Item[]>>
}


function ToDoItem(props: ToDoItemProps) {

    useEffect(() => {
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
        axios.defaults.xsrfCookieName = "csrftoken"
    }, [])

    const handleClick = (id: number) => {
        axios.patch(`api/tasks/${id}/`, {'is_finished': true})
            .then(() => {
                props.setItems(prevState => {
                    return prevState.map(item => {
                        if (item.id === id) {
                            return {
                                ...item,
                                is_finished: true
                            }
                        } else {
                            return item
                        }
                    })
                })
            })
    }

    if (!props.isFinished) {
        return (
            <div className="todo-item">
                <h1>
                    Task {props.id}
                </h1>
                <small>{props.createdAt}</small>
                <p>{props.description}</p>
                <button onClick={() => handleClick(props.id)}>Done</button>
            </div>
        )
    } else {
        return null
    }
}

export default ToDoItem