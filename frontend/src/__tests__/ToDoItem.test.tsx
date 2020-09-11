import React from "react"
import {
    render,
    waitForElementToBeRemoved,
    getByText,
    getByPlaceholderText, waitFor
} from "@testing-library/react"
import { act } from 'react-dom/test-utils'
import axios from "axios"
import userEvent from "@testing-library/user-event"

import { ITEMS } from "../utils/tests-consts"
import { ANIMATION_UNMOUNT_DURATION } from "../utils/constants"
import { getCardColor } from "../utils/tests-utils"
import ItemsFetcher from "../components/ItemsFetcher"


/**
 * Edit current item by changing its title and description.
 * @param card  the card to be changed.
 * @param title  the title to be set
 * @param description  the description to be set
 */
async function editItem(card: HTMLElement, title: string, description: string): Promise<void> {
    await userEvent.click(getByText(card, "Edit"))

    await userEvent.clear(getByPlaceholderText(card, "Title of your task"))
    await userEvent.clear(getByPlaceholderText(card, "Description of your task"))

    await userEvent.type(getByPlaceholderText(card, "Title of your task"), title)
    await userEvent.type(getByPlaceholderText(card, "Description of your task"), description)
}


describe("<ToDoItem/>", () => {
    beforeEach(() => {
        jest.spyOn(axios, 'get')
            .mockImplementation(() => Promise.resolve({
                data: ITEMS
            }))

        jest.spyOn(axios, 'patch')
            .mockImplementation(() => Promise.resolve())

        jest.spyOn(axios, 'delete')
            .mockImplementation(() => Promise.resolve())
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it("changes the color",async () => {
        await act(async () => {
            const {queryByText, container} = render(<ItemsFetcher/>)
            await waitForElementToBeRemoved(() => queryByText("Loading..."), {timeout: 5000})

            const card = container.querySelector(".todo-item")

            const yellowCircle = card.querySelector('div[title="yellow"]')
            await userEvent.click(yellowCircle)
            expect(getCardColor(card, "current")).toBe("yellow")

            const redCircle = card.querySelector('div[title="red"]')
            await userEvent.click(redCircle)
            expect(getCardColor(card, "current")).toBe("red")

            const blueCircle = card.querySelector('div[title="blue"]')
            await userEvent.click(blueCircle)
            expect(getCardColor(card, "current")).toBe("blue")

            const greenCircle = card.querySelector('div[title="green"]')
            await userEvent.click(greenCircle)
            expect(getCardColor(card, "current")).toBe("green")
        })
    })

    it("marks an item as done",async () => {
        await act(async () => {
            const {queryByText, container} = render(<ItemsFetcher/>)
            await waitForElementToBeRemoved(() => queryByText("Loading..."), {timeout: 5000})

            const card = container.querySelector(".todo-item") as HTMLElement
            const title = card.querySelector("h5").innerHTML
            expect(card.style.animationName).toBe("mount")

            await userEvent.click(getByText(card as HTMLElement, "Done"))
            expect(card.style.animationName).toBe("unmount")
            await new Promise(r => setTimeout(r, 2 * ANIMATION_UNMOUNT_DURATION))
            expect(queryByText(title).parentElement.parentElement.classList).toContain("done-item")
        })
    })

    it("deletes the item", async () => {
        await act(async () => {
            const {queryByText, container} = render(<ItemsFetcher/>)
            await waitForElementToBeRemoved(() => queryByText("Loading..."), {timeout: 5000})

            const card = container.querySelector(".todo-item") as HTMLElement
            const title = card.querySelector("h5").innerHTML
            expect(card.style.animationName).toBe("mount")

            await userEvent.click(card.querySelector("svg.x-symbol"))
            expect(card.style.animationName).toBe("unmount")
            await waitForElementToBeRemoved(() => queryByText(title))
        })
    })

    it("edits the content of the item", async () => {
        await act(async () => {
            const {queryByText, container} = render(<ItemsFetcher/>)
            await waitForElementToBeRemoved(() => queryByText("Loading..."), {timeout: 5000})

            const card = container.querySelector(".todo-item") as HTMLElement

            const initialTitle = card.querySelector("h5").innerHTML
            const initialDescription = card.querySelector("p").innerHTML
            expect(initialTitle).not.toBe("Modified title")
            expect(initialDescription).not.toBe("Modified description")

            // Edit and don't save changes
            await editItem(card, "Modified title", "Modified description")
            await userEvent.click(getByText(card, "Go back"))

            await waitFor(() => card.querySelector("h5"))
            expect(card.querySelector("h5").innerHTML).toBe(initialTitle)
            expect(card.querySelector("p").innerHTML).toBe(initialDescription)

            // Editing to the same values shouldn't call the function
            await editItem(card, initialTitle, initialDescription)
            await userEvent.click(getByText(card, "Save"))

            await waitFor(() => card.querySelector("h5"))
            expect(card.querySelector("h5").innerHTML).toBe(initialTitle)
            expect(card.querySelector("p").innerHTML).toBe(initialDescription)
            expect(axios.patch).toHaveBeenCalledTimes(0)

            // Edit and save changes
            await editItem(card, "Modified title", "Modified description")
            await userEvent.click(getByText(card, "Save"))

            await waitFor(() => card.querySelector("h5"))
            expect(card.querySelector("h5").innerHTML).toBe("Modified title")
            expect(card.querySelector("p").innerHTML).toBe("Modified description")
            expect(axios.patch).toHaveBeenCalledTimes(1)
        })
    })
})