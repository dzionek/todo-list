import React, {Dispatch, SetStateAction, useEffect, useState} from "react"
import {CirclePicker, ColorResult} from "react-color";
import axios from "axios"

import {colorNames} from "./ToDoItem";
import {Color, Item} from "../utils/typing";


interface AddToDoProps {
    items: Item[]
    setItems: Dispatch<SetStateAction<Item[]>>
}


function AddToDo(props: AddToDoProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [color, setColor] = useState<Color>('blue')

    useEffect(() => {
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
        axios.defaults.xsrfCookieName = "csrftoken"
    }, [])

    const handleChange = (color: ColorResult) => {
        const colorName = colorNames.get(color.hex)
        setColor(colorName)
    }

    let cardClassName = "card"
    let colors = ["blue", "green", "yellow", "red"]

    switch (color) {
        case "blue":
            cardClassName += " bg-info"
            colors = colors.filter(color => color !== "blue")
            break
        case "red":
            cardClassName += " bg-danger"
            colors = colors.filter(color => color !== "red")
            break
        case "green":
            cardClassName += " bg-success"
            colors = colors.filter(color => color !== "green")
            break
        case "yellow":
            cardClassName += " bg-warning"
            colors = colors.filter(color => color !== "yellow")
            break
    }

    const handleSubmit = (event: React.FormEvent) => {
        axios.post('api/tasks/', {
            'name': title,
            'description': description,
            'color': color,
            'is_finished': false
        }).then(response => {
            setTitle('')
            setDescription('')
            setColor('blue')

            const newItems = props.items.concat([response.data])
            props.setItems(newItems)
        })
        event.preventDefault()
    }

    return (
        <div className="row mt-4 mb-4">
            <div className="col-sm-2"/>
            <div className="col-sm-8">
                <div className={cardClassName}>
                    <div className="card-header text-white text-center py-2"><h5>Add a new task</h5></div>
                    <div className="card-body">
                        <form className="form-row" onSubmit={handleSubmit}>
                            <div className="col">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Title of your task"
                                        value={title}
                                        onChange={(event) => setTitle(event.target.value)}
                                    />
                                </div>
                                <div>
                                    <CirclePicker
                                        colors={colors}
                                        className="color-picker-add"
                                        onChange={(color) => handleChange(color)}
                                    />
                                </div>
                            </div>
                            <div className="col">
                        <textarea
                            className="form-control"
                            id="taskDescription"
                            placeholder="Description of your task"
                            rows={3}
                            style={{"resize": "none"}}
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Add it!
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-sm-2"/>
        </div>
    )
}

export default AddToDo