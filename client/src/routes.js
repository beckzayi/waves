import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Layout from './hoc/layout';

class Routes extends Component {
    render() {
        return (
            <Layout>
                <Switch>
                    <Route to='/' exact component={Home} />
                </Switch>
            </Layout>
        );
    }
}

export default Routes;
