import React, {useEffect, useState} from "react"
import axios from "axios"

import ToDoList from './ToDoList'
import DoneList from './DoneList'


export interface Item {
    id: number,
    description: string,
    created_at: string
    is_finished: boolean
}


function SuperList() {
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

    const getCurrentItems = () => {
        return items.filter(item => !item.is_finished)
    }

    const getDoneItems = () => {
        return items.filter(item => item.is_finished)
    }

    if (hasFailed) {
        return <div>ERROR</div>
    } else if (isLoading) {
        return <div>Loading...</div>
    } else {
        return (
            <div className="row" id="super-list">
                <div className="col-sm-6">
                    <h1>Current tasks</h1>
                    <ToDoList
                        items={getCurrentItems()}
                        setItems={setItems}
                    />
                </div>
                <div className="col-sm-6">
                    <h1>Done tasks</h1>
                    <DoneList
                        items={getDoneItems()}
                        setItems={setItems}
                    />
                </div>
            </div>
        )
    }
}

export default SuperList