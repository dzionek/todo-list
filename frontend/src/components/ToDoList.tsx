import React, {useEffect, useState} from "react"

interface ToDoItem {
    id: number,
    description: string,
    created_at: string
    isFinished: boolean
}

function ToDoList() {
    const [items, setItems] = useState<Array<ToDoItem>>([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasFailed, setHasFailed] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        fetch('api/tasks/')
            .then(response => response.json())
            .then(response => {
                setItems(response)
            })
            .catch(() => {
                setHasFailed(true)
            })
        setIsLoading(false)
    }, [])

    let content

    if (isLoading) {
        content =
            <div>
                Loading...
            </div>
    } else if (hasFailed) {
        content =
            <div>

            </div>
    } else if (items !== []) {
        content =
            <>
                {items.map(item => {
                    return (
                        <div>
                            <h1>Task {item.id}</h1>
                            <small>{item.created_at}</small>
                            <small>{item.isFinished}</small>
                            <p>{item.description}</p>
                        </div>
                    )
                })}
            </>
    }

    return content
}

export default ToDoList