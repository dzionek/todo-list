import React, {useEffect} from "react"
import axios from "axios"
import {CirclePicker, ColorResult} from "react-color"

import {Item} from './SuperList'
import {getDateFromNow} from '../utils/date'


export interface ToDoItemProps {
    id: number,
    name: string,
    description: string,
    createdAt: string
    isFinished: boolean,
    color: "white" | "green" | "yellow" | "red",
    setItems: React.Dispatch<React.SetStateAction<Item[]>>
}


const colorNames = new Map()
colorNames.set("#ffffff", "white")
colorNames.set("#008000", "green")
colorNames.set("#ffff00", "yellow")
colorNames.set("#ff0000", "red")


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
                                last_modified: Date().toString(),
                                is_finished: true
                            }
                        } else {
                            return item
                        }
                    })
                })
            })
    }

    let cardClassName = "card text-center todo-item"
    let cardFooterClassName = "card-footer"
    let colors = ["white", "green", "yellow", "red"]

    switch (props.color) {
        case "white":
            cardFooterClassName += " text-muted"
            colors = colors.filter(color => color !== "white")
            break
        case "green":
            cardClassName += " text-white bg-success"
            colors = colors.filter(color => color !== "green")
            break
        case "yellow":
            cardClassName += " text-white bg-warning"
            colors = colors.filter(color => color !== "yellow")
            break
        case "red":
            cardClassName += " text-white bg-danger"
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

    if (!props.isFinished) {
        return (
            <div className={cardClassName}>
                <div className="card-body">
                    <h5 className="card-title">{props.name}</h5>
                    <p className="card-text">{props.description}</p>
                    <CirclePicker
                        className="colors-picker"
                        colors={colors}
                        onChange={(color) => handleColorChange(color, props.id)}
                    />
                    <button onClick={() => handleClick(props.id)} className="btn btn-primary">Done</button>
                </div>
                <div className={cardFooterClassName}>
                    created: {getDateFromNow(props.createdAt)}
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default ToDoItem