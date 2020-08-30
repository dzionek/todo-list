import React, {useEffect} from "react"
import axios from "axios"

import {getDateFromNow} from '../utils/date'
import {ToDoItemProps} from "./ToDoItem";


function DoneItem(props: ToDoItemProps) {

    useEffect(() => {
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
        axios.defaults.xsrfCookieName = "csrftoken"
    }, [])

    const handleClick = (id: number) => {
        axios.patch(`api/tasks/${id}/`, {'is_finished': false})
            .then(() => {
                props.setItems(prevState => {
                    return prevState.map(item => {
                        if (item.id === id) {
                            return {
                                ...item,
                                is_finished: false
                            }
                        } else {
                            return item
                        }
                    })
                })
            })
    }

    if (props.isFinished) {
        return (
            <div className="card text-center todo-item">
                <div className="card-body">
                    <h5 className="card-title">{props.name}</h5>
                    <p className="card-text">{props.description}</p>
                    <button onClick={() => handleClick(props.id)} className="btn btn-primary">Undone</button>
                </div>
                <div className="card-footer text-muted">
                    created: {getDateFromNow(props.createdAt)}
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default DoneItem