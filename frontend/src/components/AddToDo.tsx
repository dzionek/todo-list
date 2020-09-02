import React, {FormEvent, useState} from "react"
import {CirclePicker, ColorResult} from "react-color";
import axios from "axios"

import {COLORS_MAPPING} from '../utils/constants'
import {Color, ItemsFetcherChildProps as AddToDoProps} from "../utils/typing";

/**
 * The component with the card to add new tasks.
 */
function AddToDo(props: AddToDoProps): JSX.Element {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [color, setColor] = useState<Color>('blue')

    /**
     * Change the card color.
     * @param color  The color the card should be changed to.
     */
    const handleChange = (color: ColorResult): void => {
        const colorName = COLORS_MAPPING.get(color.hex)
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

    /**
     * Add the new task to the database and to items props.
     * @param event  The event fired when the form is submitted.
     */
    const handleSubmit = (event: FormEvent): void => {
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
            <div className="col-lg-2"/>
            <div className="col-lg-8">
                <div className={cardClassName} id="add-card">
                    <div className="card-header text-white text-center py-2"><h5>Add a new task</h5></div>
                    <div className="card-body">
                        <form className="form-row">
                            <div className="col-lg">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Title of your task"
                                        value={title}
                                        onChange={(event) => setTitle(event.target.value)}
                                    />
                                </div>
                                <div id="add-card-colors">
                                    <span>Color:</span>
                                    <CirclePicker
                                        colors={colors}
                                        className="color-picker-add"
                                        onChange={(color) => handleChange(color)}
                                    />
                                </div>
                            </div>
                            <div className="col-lg">
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
                        </form>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary rounded material-light-shadow"
                        id="add-card-button"
                        onClick={handleSubmit}
                    >
                        Add it!
                    </button>
                </div>
            </div>
            <div className="col-lg-2"/>
        </div>
    )
}

export default AddToDo