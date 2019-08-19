import React, { Component } from 'react'
import {Route,Switch,Redirect} from 'react-router-dom'
import ProductHome from './product-home'
import ProductDetail from './product-detail';
import ProductAddUpdate from './product-add-update';

export default class Product extends Component {
    render() {
        return (
            <Switch>
                <Route path='/product' component={ProductHome} exact></Route>
                <Route path='/product/detail/:id' component={ProductDetail}></Route>
                <Route path='/product/addupdate' component={ProductAddUpdate}></Route>
                <Redirect to='/prouduct'></Redirect>
            </Switch>
        )
    }
}

