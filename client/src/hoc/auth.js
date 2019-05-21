import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { auth } from '../actions/user_actions';

const Auth = (WrappedComponent, requireLogIn = null, requireAdmin = null) => {
    class AuthenticationCheck extends Component {
        state = {
            loading: true
        };

        componentDidMount() {
            // Require login to access?
            if (requireLogIn) {
                this.props.dispatch(auth()).then(response => {
                    if (response.payload.isAuth !== true) {
                        this.props.history.push('/register_login');
                    }

                    // Require admin role to access?
                    if (requireAdmin) {
                        if (response.payload.isAdmin !== true) {
                            this.props.history.push('/user/dashboard');
                        }
                    }
                });
            }
            this.setState({ loading: false });
        }

        render() {
            if (this.state.loading) {
                return (
                    <div className="main_loader">
                        <CircularProgress style={{ color: 'grey' }} thickness={7} />
                    </div>
                );
            }

            return (
                <WrappedComponent {...this.props} />
            );
        }
    }

    function mapStateToProps(state) {
        return {
            user: state.user
        }
    }

    return connect(mapStateToProps)(AuthenticationCheck);
}



export default (Auth);