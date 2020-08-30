import React, {useEffect, useState} from "react"
import axios from "axios";

import {Item} from "../utils/typing";
import AddToDo from "./AddToDo";
import SuperList from "./SuperList";


function ItemsFetcher() {
    const [items, setItems] = useState<Item[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasFailed, setHasFailed] = useState(false)

    useEffect(() => {
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