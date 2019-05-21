import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Layout from './hoc/layout';
import Auth from './hoc/auth';
import RegisterLogin from './components/Register_login/index';
import Register from './components/Register_login/register';
import UserDashboard from './components/User/index';

class Routes extends Component {
    render() {
        return (
            <Layout>
                <Switch>
                    <Route path='/register_login' exact component={Auth(RegisterLogin, false)} />
                    <Route path='/register' exact component={Register} />
                    <Route path='/user/dashboard' component={Auth(UserDashboard, true)} />
                    <Route path='/' exact component={Home} />
                </Switch>
            </Layout>
        );
    }
}

export default Routes;
