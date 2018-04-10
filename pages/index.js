import React, { Component } from 'react';
import Head from 'next/head';

import Player from "../components/Player";
import Playlist from "../components/Playlist";

import withAuth from "../enhancers/WithAuth";

class Home extends Component {
  render () { return (
    <div>
      <Head>
        <title>Collaborative Playlist</title>
      </Head>
      <h1>Collaborative Playlist</h1>
      <h2>Open your console log: <code>View > Developer > JavaScript Console</code></h2>
      <Player />
      <Playlist />
      <button onClick={()=>{
        this.props.auth.refreshToken();
      }}>Refrescar Token</button>
    </div>
  )};
}

export default withAuth(Home);