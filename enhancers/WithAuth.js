import React, {Component, Fragment} from 'react'
import Router from 'next/router';

import AuthService from '../utils/AuthService';

function withAuth(AuthComponent) {
  const Auth = new AuthService('https://api.spotify.com');
  return class Authenticated extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: true
      };
    }

    componentDidMount () {
      if (!Auth.loggedIn()) {
        Router.push('/login');
      } else {
        this.setState({ isLoading: false });
      }
    }

    render() {
      return (
        <div>
          {this.state.isLoading ? (
            <div>LOADING....</div>
          ) : (
            <AuthComponent {...this.props} auth={Auth} />
          )}
        </div>
      )
    }
  }
}

export default withAuth;
