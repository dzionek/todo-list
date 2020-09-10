/* istanbul ignore file */

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
    },
    {
        id: 3, color: "green", is_finished: false,
        created_at: new Date(2000, 1, 30).toISOString(),
        last_modified: new Date(2000, 1, 30).toISOString(),
        name: "Name 3", description: "Description 3"
    },
    {
        id: 4, color: "blue", is_finished: true,
        created_at: new Date(2005, 12, 5).toISOString(),
        last_modified: new Date(2005, 1, 30).toISOString(),
        name: "Name 4", description: "Description 4"
    },
    {
        id: 5, color: "green", is_finished: false,
        created_at: new Date(2010, 1, 30).toISOString(),
        last_modified: new Date(2010, 1, 30).toISOString(),
        name: "Name 5", description: "Description 5"
    },
    {
        id: 6, color: "red", is_finished: true,
        created_at: new Date(2010, 12, 5).toISOString(),
        last_modified: new Date(2010, 1, 30).toISOString(),
        name: "Name 6", description: "Description 6"
    }
 ]

export const NEW_ITEM: Item = {
    id: 7, color: "red", is_finished: false,
    created_at: getCurrentDate(), last_modified: getCurrentDate(),
    name: "New", description: "New event was added"
}
