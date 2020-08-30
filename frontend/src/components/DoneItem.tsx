import React, {useEffect} from "react"
import axios from "axios"

import {getDateFromNow} from '../utils/date'
import {ToDoItemProps} from "./ToDoItem";


interface DoneItemProps extends ToDoItemProps {
    lastModified: string
}


function DoneItem(props: DoneItemProps) {

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
            <div className="card text-center todo-item text-white bg-dark">
                <div className="card-body">
                    <h5 className="card-title">{props.name}</h5>
                    <span className="dot" style={{'backgroundColor': props.color}}/>
                    <p className="card-text">{props.description}</p>
                    <button onClick={() => handleClick(props.id)} className="btn btn-info">Undone</button>
                </div>
                <div className="card-footer text-muted">
                    <span className="mr-4">created: {getDateFromNow(props.createdAt)}</span>
                    |
                    <span className="ml-4">done: {getDateFromNow(props.lastModified)}</span>
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default DoneItem