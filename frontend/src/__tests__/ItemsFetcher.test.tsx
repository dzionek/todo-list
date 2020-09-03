import React from "react"
import axios from "axios"
import {render, waitForElementToBeRemoved} from "@testing-library/react"

import ItemsFetcher from "../components/ItemsFetcher"
import {Item} from "../utils/typing"
import {getCurrentDate} from "../utils/date";


describe("<ItemsFetcher/>", () => {
    it("shows loading message", () => {
        const {getByText} = render(<ItemsFetcher/>)
        getByText("Loading...")
    })

    it("doesn't allow logged off user to fetch the data", async () => {
        const {queryByText, getByText} = render(<ItemsFetcher/>)
        await waitForElementToBeRemoved(() => queryByText("Loading..."), {timeout: 5000})
        getByText("ERROR")
    })

    it("receives the data from valid API call", async () => {

        jest.spyOn(axios, 'get')
            .mockImplementation((): Promise<{ data: Item[] }> => Promise.resolve({
                data: [
                    {
                        id: 1,
                        name: 'Name 1',
                        description: 'Description 1',
                        is_finished: false,
                        created_at: getCurrentDate(),
                        last_modified: getCurrentDate(),
                        color: 'blue'
                    }
                ]
            }))

        const {queryByText, getByText} = render(<ItemsFetcher/>)
        await waitForElementToBeRemoved(() => queryByText("Loading..."), {timeout: 5000})
        getByText("Name 1")
        getByText("Description 1")
        getByText("created: a few seconds ago")
    })
})