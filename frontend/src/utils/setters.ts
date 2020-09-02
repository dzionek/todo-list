import {Dispatch, SetStateAction} from "react";
import {Item} from "./typing";


/**
 * Set the items given through props by partially changing the item of the given id.
 * @param setItems  The function to set the items.
 * @param id  The id of the item to be changed.
 * @param change  The partial change of the item object.
 */
export function patchItemsProps(setItems: Dispatch<SetStateAction<Item[]>>, id: number, change: Partial<Item>): void {
    setItems(prevState => {
        return prevState.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    ...change
                }
            } else {
                return item
            }
        })
    })
}