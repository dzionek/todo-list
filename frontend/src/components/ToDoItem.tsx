import React, {useState} from "react"
import axios from "axios"
import {CirclePicker, ColorResult} from "react-color"
import {FaTimes, FaEdit, FaRegCalendarCheck, FaSave} from "react-icons/fa"
import {RiArrowGoBackFill} from "react-icons/ri"

import {ItemProps as ToDoItemProps, Animation} from '../utils/typing'
import {getCurrentDate, getDateFromNow} from '../utils/date'
import {COLORS_MAPPING} from '../utils/constants'
import {waitForUnmountAnimation} from "../utils/animation"
import {patchItemsProps} from "../utils/setters"

/**
 * The component of the item that has not yet been done.
 */
function ToDoItem(props: ToDoItemProps): JSX.Element {

    const [isEdited, setIsEdited] = useState(false)

    const [taskTitle, setTaskTitle] = useState(props.name)
    const [taskDescription, setTaskDescription] = useState(props.description)

    const [animation, setAnimation] = useState<Animation>("mount")

    /**
     * Mark the item as "done" by saving that fact in the database
     * and editing the items props.
     * @param id  The id of the item to be marked as "done".
     */
    const handleClickDone = (id: number): void => {
        axios.patch(`api/tasks/${id}/`, {'is_finished': true})
            .then(() => waitForUnmountAnimation(setAnimation))
            .then(() => patchItemsProps(
                    props.setItems, id, {
                        last_modified: getCurrentDate(), is_finished: true
                    }
                )
            )
    }

    /**
     * Save the changes of the title or/and the description of the item of the given id
     * in the database and in items props.
     * @param id  The id of the item the changes applies to.
     */
    const saveChanges = (id: number): void => {
        if (taskTitle !== props.name || taskDescription !== props.description) {
            axios.patch(`api/tasks/${id}/`, {'name': taskTitle, 'description': taskDescription})
                .then(() => {
                    patchItemsProps(
                        props.setItems, id, {
                            last_modified: getCurrentDate(),
                            name: taskTitle,
                            description: taskDescription
                        }
                    )
                })
                .then(() => {
                    setIsEdited(false)
                })
        } else {
            setIsEdited(false)
        }
    }

    /**
     * Delete the item in the database and items props.
     * @param id  The id of the item to be deleted.
     */
    const handleDelete = (id: number): void => {
        axios.delete(`api/tasks/${id}/`)
            .then(() => waitForUnmountAnimation(setAnimation))
            .then(() => {
                props.setItems(prevState => {
                    return prevState.filter(item => item.id !== id)
                })
            })
    }

    /**
     * Change the color of the item of the given id.
     * @param color  The new color of the item.
     * @param id  The id of the item which color should change.
     */
    const handleColorChange = (color: ColorResult, id: number): void => {
        const colorName = COLORS_MAPPING.get(color.hex)
        axios.patch(`api/tasks/${id}/`, {'color': colorName})
            .then(() => patchItemsProps(props.setItems, id,{color: colorName}))
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
                <FaEdit/> Edit
            </button>
            <button
                onClick={() => handleClickDone(props.id)}
                className="btn btn-primary ml-2 material-light-shadow"
            >
                <FaRegCalendarCheck/> Done
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
                <RiArrowGoBackFill/> Go back
            </button>
            <button
                className="btn btn-primary ml-2"
                onClick={() => saveChanges(props.id)}
            >
                <FaSave/> Save
            </button>
        </>

    let cardClassName = "item todo-item card text-center text-white"
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

    const cardStyles = {
        animationName: animation
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
            <div className="card-footer">
                created: {getDateFromNow(props.createdAt)}
            </div>
        </div>
    )
}

export default ToDoItem