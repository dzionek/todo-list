import React from "react"
import {render} from "@testing-library/react"
import axios from "axios"

import Account from "../components/Account"


describe("<Account/>", () => {
    jest.spyOn(axios, "get")
        .mockImplementation((): Promise<{ data: { username: string } }> => Promise.resolve({
            data: {username: "testUser"}
        }))

    it("gets the current user", async () => {
        const {getByText, findByText} = render(<Account/>)
        await findByText("testUser")
        expect(getByText("testUser").parentElement.innerHTML)
            .toBe('You are logged in as <b id="username">testUser</b>.')
    })
})