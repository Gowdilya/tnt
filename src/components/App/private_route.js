import React from 'react'
import {
  Route,
  Redirect,
} from 'react-router-dom'

const PrivateRoute = ({ component: Component, render: Render = null, isAuthenticated, ...rest }) => (
    <Route {...rest} render={(props) => (
      isAuthenticated === true ? (
        Render ? (
          Render(props)
        ) : Component ? (
          <Component {...props} />
        ): null
      ) : (
          <Redirect to='/' />
      )      
    )} />
  )

  export default PrivateRoute;