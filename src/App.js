import React, { Component } from 'react'
import {Route,Switch,BrowserRouter} from 'react-router-dom'
import Login from './pages/Login/login'


export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/login' component={Login}></Route>
                </Switch>
            </BrowserRouter>
        )
    }
}
