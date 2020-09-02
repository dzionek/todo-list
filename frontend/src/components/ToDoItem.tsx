import React, {Dispatch, SetStateAction, useEffect, useState} from "react"
import axios from "axios"
import {CirclePicker, ColorResult} from "react-color"

import {Item, Color} from '../utils/typing'
import {getDateFromNow} from '../utils/date'
import {FaTimes} from "react-icons/fa";


export interface ToDoItemProps {
    id: number,
    name: string,
    description: string,
    createdAt: string,
    lastModified: string,
    isFinished: boolean,
    color: Color,
    setItems: Dispatch<SetStateAction<Item[]>>
}

type Animation = "mount" | "unmount"


export const colorNames = new Map()
colorNames.set("#0000ff", "blue")
colorNames.set("#008000", "green")
colorNames.set("#ffff00", "yellow")
colorNames.set("#ff0000", "red")

function ToDoItem(props: ToDoItemProps) {
    // States

    const [isEdited, setIsEdited] = useState(false)

    const [taskTitle, setTaskTitle] = useState(props.name)
    const [taskDescription, setTaskDescription] = useState(props.description)

    const [animation, setAnimation] = useState<null | Animation>(null)

    // Effects

    useEffect(() => {
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
        axios.defaults.xsrfCookieName = "csrftoken"
        setAnimation('mount')
    }, [])

    // Event handlers

    const handleClickDone = (id: number): void => {
        axios.patch(`api/tasks/${id}/`, {'is_finished': true})
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
                                last_modified: new Date().toISOString(),
                                is_finished: true
                            }
                        } else {
                            return item
                        }
                    })
                })
            })
    }

    const saveChanges = (id: number): void => {
        axios.patch(`api/tasks/${id}/`, {'name': taskTitle, 'description': taskDescription})
            .then(() => {
                props.setItems(prevState => {
                    return prevState.map(item => {
                        if (item.id === id) {
                            return {
                                ...item,
                                last_modified: new Date().toISOString(),
                                name: taskTitle,
                                description: taskDescription
                            }
                        } else {
                            return item
                        }
                    })
                })
            })
            .then(() => {
                setIsEdited(false)
            })
    }

    const defaultTopContent =
        <>
            <h5 className="card-title">{props.name}</h5>
            <p className="card-text task-description">{props.description}</p>
        </>

    const defaultBottomContent =
        <>
            <button
                onClick={() => setIsEdited(true)}
                className="btn btn-light mr-2 material-light-shadow"
            >
                Edit
            </button>
            <button
                onClick={() => handleClickDone(props.id)}
                className="btn btn-primary ml-2 material-light-shadow"
            >
                Done
            </button>
        </>

    const editTopContent =
        <>
            <input
                type="text"
                placeholder="Title of your task"
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                className="top-content-input"
            />
            <textarea
                placeholder="Description of your task"
                value={taskDescription}
                onChange={(event) => setTaskDescription(event.target.value)}
                className="bottom-content-input"
            /><br />
        </>

    const editBottomContent =
        <>
            <button
                className="btn btn-secondary mr-2"
                onClick={() => {
                    setIsEdited(false)
                    setTaskTitle(props.name)
                    setTaskDescription(props.description)
                }}
            >
                Go back
            </button>
            <button
                className="btn btn-primary ml-2"
                onClick={() => saveChanges(props.id)}
            >
                Save changes
            </button>
        </>

    const handleDelete = (id: number): void => {
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

    let cardClassName = "card text-center todo-item text-white"
    let cardFooterClassName = "card-footer"
    let colors = ["blue", "green", "yellow", "red"]

    switch (props.color) {
        case "blue":
            cardClassName += " bg-info"
            colors = colors.filter(color => color !== "blue")
            break
        case "green":
            cardClassName += " bg-success"
            colors = colors.filter(color => color !== "green")
            break
        case "yellow":
            cardClassName += " bg-warning"
            colors = colors.filter(color => color !== "yellow")
            break
        case "red":
            cardClassName += " bg-danger"
            colors = colors.filter(color => color !== "red")
    }

    const handleColorChange = (color: ColorResult, id: number) => {
        const colorName = colorNames.get(color.hex)
        axios.patch(`api/tasks/${id}/`, {'color': colorName})
            .then(() => {
                props.setItems(prevState => {
                    return prevState.map(item => {
                        if (item.id === id) {
                            return {
                                ...item,
                                color: colorName
                            }
                        } else {
                            return item
                        }
                    })
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
        <div className={cardClassName} style={cardStyles}>
            <div className="card-body">
                {isEdited ? editTopContent : defaultTopContent}


                <FaTimes className="x-symbol" onClick={() => handleDelete(props.id)}/>
                <CirclePicker
                    className="colors-picker"
                    colors={colors}
                    onChange={(color) => handleColorChange(color, props.id)}
                />

                {isEdited? editBottomContent : defaultBottomContent}
            </div>
            <div className={cardFooterClassName}>
                created: {getDateFromNow(props.createdAt)}
            </div>
        </div>
    )
}

export default ToDoItem