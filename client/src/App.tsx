import React, { useState, useEffect } from 'react'
import { Switch, Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { PrivateRoute } from './routing/PrivateRoute'
import { PublicRoute } from './routing/PublicRoute'
import { Login } from './views/Login'
import { Chat } from './views/Chat'
import { login } from './store/auth.slice'

export const App = () => {
  const dispatch = useDispatch()
  const [hasCheckedIfUserIsLoggedIn, setHasCheckedIfUserIsLoggedIn] = useState(false)

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user')

    if (loggedInUser) {
      dispatch(login(JSON.parse(loggedInUser)))
    }

    setHasCheckedIfUserIsLoggedIn(true)
  }, [dispatch, setHasCheckedIfUserIsLoggedIn])

  if (!hasCheckedIfUserIsLoggedIn) {
   
    return <div className="flex justify-center items-center h-screen bg-gray-100">Loading...</div>
  }

  return (
    <Switch>
      <PublicRoute component={Login} exact path="/" />
      <PrivateRoute component={Chat} exact path="/chat" />
      <Redirect to="/" />
    </Switch>
  )
}
