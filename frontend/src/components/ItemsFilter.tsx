import React, {Dispatch, SetStateAction, useState} from "react"
import {FaFilter} from "react-icons/fa"

import {ItemsFilterType} from "../utils/typing";


interface ItemsFilterProps {
    setItemsFilter:  Dispatch<SetStateAction<ItemsFilterType>>
}


function ItemsFilter(props: ItemsFilterProps): JSX.Element {
    const [isFiltering, setIsFiltering] = useState(false)

    return (
        <div className="items-filter">
            {isFiltering ?
                <>
                    <span
                        className="badge badge-pill badge-light mr-4"
                        onClick={() => {
                            props.setItemsFilter("all")
                            setIsFiltering(false)
                        }}
                    >
                    all
                    </span>
                        <span
                            className="badge badge-pill badge-info mr-4"
                            onClick={() => props.setItemsFilter("blue")}
                        >
                        blue
                    </span>
                    <span
                    className="badge badge-pill badge-warning mr-4"
                    onClick={() => props.setItemsFilter("yellow")}
                    >
                    yellow
                    </span>
                    <span
                    className="badge badge-pill badge-success mr-4"
                    onClick={() => props.setItemsFilter("green")}
                    >
                    green
                    </span>
                    <span
                    className="badge badge-pill badge-danger"
                    onClick={() => props.setItemsFilter("red")}
                    >
                    red
                    </span>
                </> :

                <span
                    className="badge badge-pill badge-secondary mr-4"
                    onClick={() => setIsFiltering(true)}
                >
                    <FaFilter/> Filter
                </span>
            }

        </div>
    )
}

export default ItemsFilter