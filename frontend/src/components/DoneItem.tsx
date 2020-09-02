import React, {useState} from "react"
import axios from "axios"
import {FaTimes} from "react-icons/fa"

import {getDateFromNow, getCurrentDate} from '../utils/date'
import {ItemProps as DoneItemProps, Animation} from "../utils/typing";
import {waitForUnmountAnimation} from "../utils/animation";
import {patchItemsProps} from "../utils/setters";

/**
 * The component of the item that has already been done.
 */
function DoneItem(props: DoneItemProps) {
    const [animation, setAnimation] = useState<Animation>("mount")

    /**
     * Revert the "done" status of the item in the database and items props.
     * @param id  The id of the item which should not be marked as "done".
     */
    const handleClick = (id: number) => {
        axios.patch(`api/tasks/${id}/`, {'is_finished': false})
            .then(() => waitForUnmountAnimation(setAnimation))
            .then(() => patchItemsProps(
                    props.setItems, id, {last_modified: getCurrentDate(), is_finished: false}
                )
            )
    }

    /**
     * Delete the item in the database and items props.
     * @param id  The id of the item to be deleted.
     */
    const handleDelete = (id: number) => {
        axios.delete(`api/tasks/${id}/`)
            .then(() => waitForUnmountAnimation(setAnimation))
            .then(() => {
                props.setItems(prevState => {
                    return prevState.filter(item => item.id !== id)
                })
            })
    }

    const cardStyles = {
        animationName: animation
    }


    return (
        <div className="card text-center todo-item text-white bg-dark" style={cardStyles}>
            <div className="card-body">
                <h5 className="card-title">{props.name}</h5>
                <FaTimes className="x-symbol" onClick={() => handleDelete(props.id)}/>
                <span className="dot" style={{'backgroundColor': props.color}}/>
                <p className="card-text">{props.description}</p>
                <button
                    onClick={() => handleClick(props.id)}
                    className="btn btn-info material-light-shadow"
                >
                    Undone
                </button>
            </div>
            <div className="card-footer text-muted row">
                <div className="col-lg card-footer-created">created: {getDateFromNow(props.createdAt)}</div>
                <div className="col-lg card-footer-done">done: {getDateFromNow(props.lastModified)}</div>
            </div>
        </div>
    )
}

export default DoneItem