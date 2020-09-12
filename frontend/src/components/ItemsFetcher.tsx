import React, {useEffect, useState} from "react"
import axios from "axios"

import {Item} from "../utils/typing"
import AddToDo from "./AddToDo"
import SuperList from "./SuperList"
import Account from "./Account"

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
        window.location.href = axios.defaults.baseURL
        return null
    } else if (isLoading) {
        return <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
    } else {
        return (
            <>
                <div className="row mt-4 mb-4">
                    <div className="col-lg-2">
                        <Account/>
                    </div>
                    <div className="col-lg-8">
                        <AddToDo
                            items={items}
                            setItems={setItems}
                        />
                    </div>
                    <div className="col-lg-2"/>
                </div>
                <SuperList
                    items={items}
                    setItems={setItems}
                />
            </>
        )
    }
}

export default ItemsFetcher