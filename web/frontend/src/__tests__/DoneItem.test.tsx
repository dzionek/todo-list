import React from "react"
import {
    getByText,
    render,
    waitForElementToBeRemoved
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {act} from "react-dom/test-utils"
import axios from "axios"

import ItemsFetcher from "../components/ItemsFetcher"
import {ANIMATION_UNMOUNT_DURATION} from "../utils/constants"
import {ITEMS} from "../utils/tests-consts"


describe("<DoneItem/>", () => {
    jest.spyOn(axios, 'get')
        .mockImplementation(() => Promise.resolve({
            data: ITEMS
        }))

    jest.spyOn(axios, 'patch')
        .mockImplementation(() => Promise.resolve())

    jest.spyOn(axios, 'delete')
        .mockImplementation(() => Promise.resolve())

    it("marks an item as undone",async () => {
        await act(async () => {
            const {queryByText, container} = render(<ItemsFetcher/>)
            await waitForElementToBeRemoved(() => queryByText("Loading..."), {timeout: 5000})

            const card = container.querySelector(".done-item") as HTMLElement
            const title = card.querySelector("h5").innerHTML
            expect(card.style.animationName).toBe("mount")

            await userEvent.click(getByText(card as HTMLElement, "Undone"))
            expect(card.style.animationName).toBe("unmount")
            await new Promise(r => setTimeout(r, 2 * ANIMATION_UNMOUNT_DURATION))
            expect(queryByText(title).parentElement.parentElement.classList).toContain("todo-item")
        })
    })

    it("deletes the item", async () => {
        await act(async () => {
            const {queryByText, container} = render(<ItemsFetcher/>)
            await waitForElementToBeRemoved(() => queryByText("Loading..."), {timeout: 5000})

            const card = container.querySelector(".done-item") as HTMLElement
            const title = card.querySelector("h5").innerHTML
            expect(card.style.animationName).toBe("mount")

            await userEvent.click(card.querySelector("svg.x-symbol"))
            expect(card.style.animationName).toBe("unmount")
            await waitForElementToBeRemoved(() => queryByText(title))
        })
    })
})