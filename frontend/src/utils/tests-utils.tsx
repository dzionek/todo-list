/* istanbul ignore file */

import React from "react"
import axios from "axios"
import {render, waitForElementToBeRemoved} from "@testing-library/react"

import {Color} from "./typing"
import {ITEMS} from "../utils/tests-consts"
import ItemsFetcher from "../components/ItemsFetcher"


type CardCategory = "current" | "done"

/**
 * Gets all titles from the given tasks list.
 * @param tasksList  The div where all current/done tasks are placed.
 */
export function getTitlesInner(tasksList: Element): string[] {
    const titles = tasksList.querySelectorAll('h5')
    return Array.from(titles).map(title => title.innerHTML)
}

/**
 * Get color of the task from current or done card.
 * @param card  card which color should be checked
 * @param cardCategory  information whether the task is done or not.
 */
export function getCardColor(card: Element, cardCategory: CardCategory): Color {
    let color: Color

    if (cardCategory === "current") {
        const cardClassName = card.className
        if (cardClassName.includes("info")) {
            color = "blue"
        } else if (cardClassName.includes("success")) {
            color = "green"
        } else if (cardClassName.includes("warning")) {
            color = "yellow"
        } else if (cardClassName.includes("danger")) {
            color = "red"
        } else {
            throw Error(`Card class name is invalid: ${cardClassName}`)
        }
    } else {
        const circle = card.querySelector("span")
        color = circle.style.backgroundColor as Color
    }

    return color
}

/**
 * Unit test for <ToDoList/> or <DoneList/>.
 * @param which  information which one should be tested.
 */
export function testTasksList(which: CardCategory): void {
    jest.spyOn(axios, 'get')
        .mockImplementation(() => Promise.resolve({
            data: ITEMS
        }))

    it("loads correctly", async () => {
        const {queryByText, container} = render(<ItemsFetcher/>)
        await waitForElementToBeRemoved(
            () => queryByText("Loading..."),
            {timeout: 5000}
            )

        const list = which === "current" ?
            container.querySelector('#todo-list') :
            container.querySelector('#done-list')

        const expectedItems = ITEMS.filter(item => {
            if (which === "current") {
                return !item.is_finished
            } else {
                return item.is_finished
            }
        })
        const actualItems = Array.from(list.children).map(card => {
            const title = card.querySelector("h5").innerHTML
            const description = card.querySelector("p").innerHTML
            const color = getCardColor(card, which)

            return {
                name: title, description: description, color: color
            }
        })

        actualItems.forEach(actualItem => {
            const expectedItem = expectedItems
                .filter(i => i.name === actualItem.name)[0]
            expect(actualItem.color).toBe(expectedItem.color)
            expect(actualItem.description).toBe(expectedItem.description)
        })
    })
}