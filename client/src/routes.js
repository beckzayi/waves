import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Layout from './hoc/layout';
import RegisterLogin from './components/Register_login/index';
import Register from './components/Register_login/register';
import UserDashboard from './components/User/index';

class Routes extends Component {
    render() {
        return (
            <Layout>
                <Switch>
                    <Route path='/register_login' exact component={RegisterLogin} />
                    <Route path='/register' exact component={Register} />
                    <Route path='/user/dashboard' component={UserDashboard} />
                    <Route path='/' exact component={Home} />
                </Switch>
            </Layout>
        );
    }
}

export default Routes;
