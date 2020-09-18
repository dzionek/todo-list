import React from "react"
import {render, waitForElementToBeRemoved} from "@testing-library/react"
import userEvent from '@testing-library/user-event'

import ItemsFetcher from "../components/ItemsFetcher"
import axios from "axios";
import {ITEMS} from "../utils/tests-consts";
import {getTitlesInner} from "../utils/tests-utils"


describe("<SuperList/>", () => {
    jest.spyOn(axios, 'get')
        .mockImplementation(() => Promise.resolve({
            data: ITEMS
        }))

    it("gets current items by last modified", async () => {
        const {container, queryByText, getByText} = render(<ItemsFetcher/>)
        await waitForElementToBeRemoved(() => queryByText("Loading..."), {timeout: 5000})

        const todoList = container.querySelector('#todo-list')
        expect(getTitlesInner(todoList))
            .toStrictEqual(["Marathon", "Name 5", "Name 3"])

        const filterDiv = container.querySelector("#todo-filter")
        userEvent.click(filterDiv.querySelector("span"))
        userEvent.click(getByText("green"))

        expect(Array.from(getTitlesInner(todoList)))
            .toStrictEqual(["Name 5", "Name 3"])
    })

    it("gets done items by last modified", async () => {
        const {container, queryByText, getByText} = render(<ItemsFetcher/>)
        await waitForElementToBeRemoved(() => queryByText("Loading..."), {timeout: 5000})

        const todoList = container.querySelector('#done-list')
        expect(getTitlesInner(todoList))
            .toStrictEqual(["Coursework", "Name 6", "Name 4"])

        const filterDiv = container.querySelector("#done-filter")
        userEvent.click(filterDiv.querySelector("span"))
        userEvent.click(getByText("blue"))

        expect(getTitlesInner(todoList))
            .toStrictEqual(["Coursework", "Name 4"])
    })
})