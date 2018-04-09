import {Component} from "react";
import Router from "next/router";
import AuthService from "../utils/AuthService";

const Auth = new AuthService('https://api.spotify.com');

export default class AuthRoute extends Component {
  componentDidMount() {
    if (this.props.url.query.user) {
      Auth.setProfile(this.props.url.query.user);
      Router.push('/');
    } else {
      Router.push('/login');
    }
  }

  render() {
    return null;
  }
}