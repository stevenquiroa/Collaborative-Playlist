import React, { Component } from 'react';
import Head from 'next/head';
import Router from 'next/router';

export default class Login extends Component {
  componentDidMount = () => {
    window.onSpotifyWebPlaybackSDKReady = () => {}
  };
  render() {
    return (
      <div>
        <Head>
          <title>Login</title>
        </Head>
        <button onClick={()=>{
          Router.push('/auth/spotify');
        }}>Login with Spotify</button>
      </div>
    );
  }
}