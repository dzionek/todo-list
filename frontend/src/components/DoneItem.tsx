import React, {useEffect, useState} from "react"
import axios from "axios"
import {FaTimes} from "react-icons/fa"

import {getDateFromNow} from '../utils/date'
import {ToDoItemProps} from "./ToDoItem";


function DoneItem(props: ToDoItemProps) {
    const [animation, setAnimation] = useState<null | "mount" | "unmount">(null)

    useEffect(() => {
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
        axios.defaults.xsrfCookieName = "csrftoken"
        setAnimation('mount')
    }, [])

    const handleClick = (id: number) => {
        axios.patch(`api/tasks/${id}/`, {'is_finished': false})
            .then(async () => {
                setAnimation('unmount')
                await new Promise(r => setTimeout(r, 500))
            })
            .then(() => {
                props.setItems(prevState => {
                    return prevState.map(item => {
                        if (item.id === id) {
                            return {
                                ...item,
                                last_modified: Date().toString(),
                                is_finished: false
                            }
                        } else {
                            return item
                        }
                    })
                })
            })
    }

    const handleDelete = (id: number) => {
        axios.delete(`api/tasks/${id}/`)
            .then(async () => {
                setAnimation('unmount')
                await new Promise(r => setTimeout(r, 500))
            })
            .then(() => {
                props.setItems(prevState => {
                    return prevState.filter(item => item.id !== id)
                })
            })
    }

    let cardStyles

    if (animation !== null) {
        cardStyles = {
            animationName: animation
        }
    }

    return (
        <div className="card text-center todo-item text-white bg-dark" style={cardStyles}>
            <div className="card-body">
                <h5 className="card-title">{props.name}</h5>
                <FaTimes className="x-symbol" onClick={() => handleDelete(props.id)}/>
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
}

export default DoneItem