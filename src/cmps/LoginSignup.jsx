import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import React, { useState } from "react";

export function LoginSignup() {

    const [isSignup, setIsSignUp] = useState(false)
    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())
    const [error, setError] = useState('')
    const [loggedInUser, setLoggedInUser] = useState(null)

    function handleChange({ target }) {
        const { name: field, value } = target
        setCredentials(prevCreds => ({ ...prevCreds, [field]: value }))
    }

    async function handleSubmit(ev) {
        ev.preventDefault()
        try {
            await onLogin(credentials)
            setError('') // Clear any previous error message
        } catch (err) {
            setError('Oops, something went wrong. Please try again.')
        }
    }

    async function onLogin(credentials) {
        if (isSignup) {
            await signup(credentials)
        } else {
            await login(credentials)
        }
    }

    async function login(credentials) {
        try {
            const user = await userService.login(credentials)
            setUser(user)
            showSuccessMsg('Logged in successfully')
        } catch (err) {
            showErrorMsg('Login failed. Please try again.')
            throw err // Re-throw error to be caught by handleSubmit
        }
    }

    async function signup(credentials) {
        try {
            const user = await userService.signup(credentials)
            setUser(user)
            showSuccessMsg('Signed up successfully')
        } catch (err) {
            showErrorMsg('Signup failed. Please try again.')
            throw err // Re-throw error to be caught by handleSubmit
        }
    }

    function setUser(user) {
        setLoggedInUser(user)
        sessionStorage.setItem('loggedInUser', JSON.stringify(user))
        // Perform any other necessary state updates or actions here
    }

    return (
        <div className="login-page">
            {loggedInUser ? (
                <div>
                    <h2>Welcome, {loggedInUser.username}!</h2>
                </div>
            ) : (
                <>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            value={credentials.username}
                            placeholder="Username"
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            placeholder="Password"
                            onChange={handleChange}
                            required
                            autoComplete="off"
                        />
                        {isSignup && <input
                            type="text"
                            name="fullname"
                            value={credentials.fullname}
                            placeholder="Full name"
                            onChange={handleChange}
                            required
                        />}
                        <button>{isSignup ? 'Signup' : 'Login'}</button>
                    </form>

                    {error && <div className="error-msg">{error}</div>}

                    <div className="btns">
                        <a href="#" onClick={(ev) => {
                            ev.preventDefault()
                            setIsSignUp(!isSignup)
                        }}>
                            {isSignup ?
                                'Already a member? Login' :
                                'New user? Signup here'
                            }
                        </a >
                    </div>
                </>
            )}
        </div >
    )
}
