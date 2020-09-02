import React, {useEffect, useState} from "react"
import axios from "axios";

import {Item} from "../utils/typing";
import AddToDo from "./AddToDo";
import SuperList from "./SuperList";

/**
 * The component responsible for fetching items from API
 * passing them to sub-components.
 */
function ItemsFetcher(): JSX.Element {
    const [items, setItems] = useState<Item[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasFailed, setHasFailed] = useState(false)

    useEffect(() => {
        // Axios settings to handle CSRF token validation in Django.
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
        axios.defaults.xsrfCookieName = "csrftoken"

        setIsLoading(true)
        axios.get('api/tasks/')
            .then(response => {
                setItems(response.data)
                setIsLoading(false)
            })
            .catch(() => {
                setHasFailed(true)
            })
    }, [])

    if (hasFailed) {
        return <div>ERROR</div>
    } else if (isLoading) {
        return <div>Loading...</div>
    } else {
        return (
            <>
                <AddToDo
                    items={items}
                    setItems={setItems}
                />
                <SuperList
                    items={items}
                    setItems={setItems}
                />
            </>
        )
    }
}

export default ItemsFetcher