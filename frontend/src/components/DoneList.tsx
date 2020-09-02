import React from "react"

import DoneItem from "./DoneItem"
import {ItemsFetcherChildProps as DoneListProps} from '../utils/typing'

/**
 * The component with the list of items that have already been done.
 */
function DoneList(props: DoneListProps) {
    return (
        <div id="done-list">
            {props.items.map(item => {
                return (
                    <DoneItem
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        description={item.description}
                        createdAt={item.created_at}
                        lastModified={item.last_modified}
                        isFinished={item.is_finished}
                        color={item.color}
                        setItems={props.setItems}
                    />
                )
            })}
        </div>
    )
}

export default DoneList