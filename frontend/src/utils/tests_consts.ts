/** Some constants used in multiple places by the tests. */

import {Item} from "../utils/typing"
import {getCurrentDate} from "../utils/date"


export const ITEMS: Item[] = [
        {
            id: 1, color: "red", is_finished: false,
            created_at: getCurrentDate(), last_modified: getCurrentDate(),
            name: "Marathon", description: "Run a marathon"
        },
        {
            id: 2, color: "blue", is_finished: true,
            created_at: getCurrentDate(), last_modified: getCurrentDate(),
            name: "Coursework", description: "Do the coursework for SE"
        }
 ]

export const NEW_ITEM: Item = {
    id: 3, color: "red", is_finished: false,
    created_at: getCurrentDate(), last_modified: getCurrentDate(),
    name: "New", description: "New event was added"
}
