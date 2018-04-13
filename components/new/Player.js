import React, { Component }  from 'react';
import cookies from '../../utils/cookies';
import PlayerContext from '../../contexts/player-context';

import PlayerService from "../../utils/PlayerService";
// import PlaylistService from "../utils/PlaylistService";

const Player = new PlayerService('https://api.spotify.com');

class CollaborativePlayer extends Component {
  player = null;
  componentDidMount() {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = cookies.getItem('accessToken');
      this.player = new Spotify.Player({
        name: 'Collaborative Playlist Player',
        getOAuthToken: cb => { cb(token); }
      });

      // Error handling
      this.player.addListener('initialization_error', ({ message }) => { console.error(message); });
      this.player.addListener('authentication_error', ({ message }) => { console.error(message); });
      this.player.addListener('account_error', ({ message }) => { console.error(message); });
      this.player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      this.player.addListener('player_state_changed', (player) => {
        console.log('player', player);
        // Player.setStatus(player);
        // if (player) {
        //   const currentPlayer = {
        //     id: Player.getDevice(),
        //     name: 'Collaborative Playlist Player',
        //   };
        //   Player.setCurrentDevice(currentPlayer);
        //   this.setState({ player, currentPlayer });
        // } else {
        //   this.setState({ player });
        // }

      });

      // Ready
      this.player.addListener('ready', ({ device_id }) => {
        Player.setDevice({
          id: device_id,
          name: this.player._options.name,
        });
      });
      // Connect to the player!
      this.player.connect();
    };

    Player.fetchStatus().then((res) => {
      if (res) {
        const { device } = res;
        this.props.context.setDevice(device);
        Player.setCurrentDevice(device);
      }
    });
  }
  render() {
    return (
      <p>Player</p>
    );
  }
}

export default props => (
  <PlayerContext.Consumer>
    {context => <CollaborativePlayer {...props} context={context} />}
  </PlayerContext.Consumer>
);



