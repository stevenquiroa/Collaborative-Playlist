import React, {Component, Fragment} from 'react';
import Head from 'next/head';

import { PlayerProvider } from "../contexts/player-context";
import { PlaylistProvider } from "../contexts/playlist-context";

import LeftContainer from '../components/new/LeftContainer';
import RightContainer from '../components/new/RightContainer';

import withAuth from "../enhancers/WithAuth";

class PlayerPage extends Component {
  render() {
    return(
      <Fragment>
        <Head>
          <title>Collaborative Playlist</title>
          <script src="https://sdk.scdn.co/spotify-player.js"/>
        </Head>
        <PlaylistProvider>
          <PlayerProvider>
            <div style={{
              display: 'block',
              width: '100%',
            }}>
              <LeftContainer />
              <RightContainer />
            </div>
          </PlayerProvider>
        </PlaylistProvider>
      </Fragment>
    )
  }

}

export default withAuth(PlayerPage);