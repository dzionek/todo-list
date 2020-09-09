import React from "react"
import {render, waitForElementToBeRemoved} from "@testing-library/react"
import userEvent from '@testing-library/user-event'

import ItemsFetcher from "../components/ItemsFetcher"
import axios from "axios";
import {ITEMS} from "../utils/tests_consts";


describe("<SuperList/>", () => {
    jest.spyOn(axios, 'get')
        .mockImplementation(() => Promise.resolve({
            data: ITEMS
        }))

    it("gets current items by last modified", async () => {
        const {container, queryByText, getByText} = render(<ItemsFetcher/>)
        await waitForElementToBeRemoved(() => queryByText("Loading..."), {timeout: 5000})

        const todoList = container.querySelector('#todo-list')
        let titles = todoList.querySelectorAll('h5')
        expect(Array.from(titles).map(title => title.innerHTML))
            .toStrictEqual(["Marathon", "Name 5", "Name 3"])

        const filterDiv = container.querySelector("#todo-filter")
        userEvent.click(filterDiv.querySelector("span"))
        userEvent.click(getByText("green"))

        titles = todoList.querySelectorAll('h5')
        expect(Array.from(titles).map(title => title.innerHTML))
            .toStrictEqual(["Name 5", "Name 3"])
    })

    it("gets done items by last modified", async () => {
        const {container, queryByText, getByText} = render(<ItemsFetcher/>)
        await waitForElementToBeRemoved(() => queryByText("Loading..."), {timeout: 5000})

        const todoList = container.querySelector('#done-list')
        let titles = todoList.querySelectorAll('h5')
        expect(Array.from(titles).map(title => title.innerHTML))
            .toStrictEqual(["Coursework", "Name 6", "Name 4"])

        const filterDiv = container.querySelector("#done-filter")
        userEvent.click(filterDiv.querySelector("span"))
        userEvent.click(getByText("blue"))

        titles = todoList.querySelectorAll('h5')
        expect(Array.from(titles).map(title => title.innerHTML))
            .toStrictEqual(["Coursework", "Name 4"])
    })
})