import React from "react"
import {render, waitForElementToBeRemoved} from "@testing-library/react"
import axios from "axios"

import ItemsFetcher from "../components/ItemsFetcher"
import {ITEMS} from "../utils/tests-consts"
import {getTitlesInner} from "../utils/tests-utils"
import userEvent from "@testing-library/user-event";


describe("<ItemsFilter/>", () => {
    jest.spyOn(axios, 'get')
        .mockImplementation(() => Promise.resolve({
            data: ITEMS
        }))

    it("filters current items", async () => {
        const {queryByText, getByText, container} = render(<ItemsFetcher/>)
        await waitForElementToBeRemoved(() => queryByText("Loading..."), {timeout: 5000})

        const filter = container.querySelector("#todo-filter")
        const cards = container.querySelector("#todo-list")

        expect(getTitlesInner(cards))
            .toStrictEqual(["Marathon", "Name 5", "Name 3"])

        expect(filter.querySelector("span").innerHTML)
            .toContain("Filter")

        userEvent.click(filter.querySelector("span"))

        expect(filter.querySelector("span").innerHTML)
        .not.toContain("Filter")

        userEvent.click(getByText("green"))
        expect(getTitlesInner(cards))
            .toStrictEqual(["Name 5", "Name 3"])

        userEvent.click(getByText("red"))
        expect(getTitlesInner(cards))
            .toStrictEqual(["Marathon"])

        userEvent.click(getByText("blue"))
        expect(getTitlesInner(cards))
            .toStrictEqual([])

        userEvent.click(getByText("yellow"))
        expect(getTitlesInner(cards))
            .toStrictEqual([])


        userEvent.click(getByText("all"))
        expect(getTitlesInner(cards))
            .toStrictEqual(["Marathon", "Name 5", "Name 3"])
    })

    it("filters done items", async () => {
        const {queryByText, getByText, container} = render(<ItemsFetcher/>)
        await waitForElementToBeRemoved(() => queryByText("Loading..."), {timeout: 5000})

        const filter = container.querySelector("#done-filter")
        const cards = container.querySelector("#done-list")

        expect(getTitlesInner(cards))
            .toStrictEqual(["Coursework", "Name 6", "Name 4"])

        expect(filter.querySelector("span").innerHTML)
            .toContain("Filter")

        userEvent.click(filter.querySelector("span"))

        expect(filter.querySelector("span").innerHTML)
            .not.toContain("Filter")

        userEvent.click(getByText("green"))
        expect(getTitlesInner(cards))
            .toStrictEqual([])

        userEvent.click(getByText("red"))
        expect(getTitlesInner(cards))
            .toStrictEqual(["Name 6"])

        userEvent.click(getByText("blue"))
        expect(getTitlesInner(cards))
            .toStrictEqual(["Coursework", "Name 4"])

        userEvent.click(getByText("yellow"))
        expect(getTitlesInner(cards))
            .toStrictEqual([])


        userEvent.click(getByText("all"))
        expect(getTitlesInner(cards))
            .toStrictEqual(["Coursework", "Name 6", "Name 4"])
    })
})