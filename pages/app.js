import React, {Component, Fragment} from 'react';
import Head from 'next/head';

import Player from "../components/Player";
import Playlist from "../components/Playlist";
import LiveReorder from "../components/LiveReorder";

import CreateOrUpdatePlaylist from "../components/CreateOrUpdatePlaylist";

import withAuth from "../enhancers/WithAuth";

class App extends Component {
  state = {
    step: 0,
  };

  componentDidMount() {

  }

  template (body) {
    return (
      <div>
        <Head>
          <title>Collaborative Playlist</title>
        </Head>
        <h1>Collaborative Playlist</h1>
        {body}
        <br/>
        <button onClick={()=>{
          this.props.auth.refreshToken();
        }}>Refrescar Token</button>
      </div>
    )
  }

  changeStep = (step) => {
    console.log("changestep", step);
    this.setState({ step });
  };

  render () {
    if (this.state.step < 2) {
      return this.template(
        <CreateOrUpdatePlaylist
          nextStep={() => this.changeStep(2)}
        />
      )
    }
    return this.template(
      <Fragment>
        <LiveReorder />
        <Player />
        <Playlist />
        <Head>
          <script src="https://sdk.scdn.co/spotify-player.js"/>
        </Head>
      </Fragment>
    );
  };
}

export default withAuth(App);