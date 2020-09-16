import React, {useEffect, useState} from "react"
import axios from "axios"

type UserResponse = {
    username: string
}

function Account(): JSX.Element {
    const [username, setUsername] = useState('')

    useEffect(() => {
        axios.get('api/user')
            .then(response => {
                const userResponse = response.data as UserResponse
                setUsername(userResponse.username)
            })
    }, [])

    return (
        <div className="card light-background material-light-shadow rounded">
            <div className="card-body text-center">
                <p className="card-text"><small>You are logged in as <b id="username">{username}</b>.</small></p>
                <a href={`${axios.defaults.baseURL}/logout`} className="btn btn-outline-primary btn-sm">Log out</a>
            </div>
        </div>
    )
}

export default Account