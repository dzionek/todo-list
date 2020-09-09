import React from "react"
import {render, waitForElementToBeRemoved, act} from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import axios from "axios"

import ItemsFetcher from "../components/ItemsFetcher"
import {ITEMS, NEW_ITEM} from "../utils/tests_consts"


describe("<AddToDo/>",() => {
    jest.spyOn(axios, 'get')
        .mockImplementation(() => Promise.resolve({
            data: ITEMS
        }))

    jest.spyOn(axios, 'post')
        .mockImplementation(() => Promise.resolve({
            data: NEW_ITEM
        }))

    it("sets blue as the default color", async () => {
        const {queryByText, container} = render(<ItemsFetcher/>)
        await waitForElementToBeRemoved(() => queryByText("Loading..."), {timeout: 5000})

        const addCard = container.querySelector('#add-card')
        expect(addCard.classList).toContain('bg-info')
    })

    it("changes colors", async () => {
        const {queryByText, container} = render(<ItemsFetcher/>)
        await waitForElementToBeRemoved(() => queryByText("Loading..."), {timeout: 5000})

        const addCard = container.querySelector('#add-card')
        const greenCircle = addCard.querySelector('div[title="green"]')

        userEvent.click(greenCircle)
        expect(addCard.classList).toContain('bg-success')

        const blueCircle = addCard.querySelector('div[title="blue"]')
        userEvent.click(blueCircle)
        expect(addCard.classList).toContain('bg-info')

        const yellowCircle = addCard.querySelector('div[title="yellow"]')
        userEvent.click(yellowCircle)
        expect(addCard.classList).toContain('bg-warning')

        const redCircle = addCard.querySelector('div[title="red"]')
        userEvent.click(redCircle)
        expect(addCard.classList).toContain('bg-danger')
    })

    it("adds a task", async () => {
        const {queryByText, container, getByText, findByPlaceholderText} = render(<ItemsFetcher/>)
        await waitForElementToBeRemoved(() => queryByText("Loading..."), {timeout: 5000})

        const addTitle = container.querySelector('#add-task-title')
        const addDescription = container.querySelector('#add-task-description')

        expect(queryByText("New")).toBeNull()
        expect(queryByText("New event was added")).toBeNull()

        await act(async () => {
            await userEvent.type(addTitle, "New")
            await userEvent.type(addDescription, "New event was added")

            userEvent.click(getByText('Add it'))
        })

        const titleInput = await findByPlaceholderText("Title of your task")
        expect((titleInput as HTMLInputElement).value).toBe("")

        getByText("New")
        getByText("New event was added")
    })
})