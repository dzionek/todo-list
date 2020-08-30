import React, {Dispatch, SetStateAction, useEffect, useState} from "react"
import axios from "axios"
import {CirclePicker, ColorResult} from "react-color"

import {Item, Color} from '../utils/typing'
import {getDateFromNow} from '../utils/date'


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


export const colorNames = new Map()
colorNames.set("#0000ff", "blue")
colorNames.set("#008000", "green")
colorNames.set("#ffff00", "yellow")
colorNames.set("#ff0000", "red")


function ToDoItem(props: ToDoItemProps) {
    const [animation, setAnimation] = useState<null | "mount" | "unmount">(null)

    useEffect(() => {
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
        axios.defaults.xsrfCookieName = "csrftoken"
        setAnimation('mount')
    }, [])

    const handleClick = (id: number) => {
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
}

export default ToDoItem