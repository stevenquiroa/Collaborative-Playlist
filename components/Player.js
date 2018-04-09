import React, {Component, Fragment} from 'react';
import cookies from '../utils/cookies';

class Player extends Component {
  state = {
    current_track: null,
  };

  componentDidMount () {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = cookies.getItem('accessToken');
      this.player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); }
      });

      // Error handling
      this.player.addListener('initialization_error', ({ message }) => { console.error(message); });
      this.player.addListener('authentication_error', ({ message }) => { console.error(message); });
      this.player.addListener('account_error', ({ message }) => { console.error(message); });
      this.player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      this.player.addListener('player_state_changed', (state) => {
        const { position, duration, track_window, context } = state;
        console.log('Currently Playing', track_window);
        console.log('Position in Song', position);
        console.log('Duration of Song', duration);
        console.log('Context', context);

        this.setState({ current_track: track_window.current_track });
      });

      // Ready
      this.player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      // Connect to the player!
      this.player.connect();
    };
  }
  render() {
    const { current_track } = this.state;
    return (
      <Fragment>
        <p>-- Player Begin --</p>
        {current_track && (
          <p>Suena: {current_track.name} </p>
        )}
        <button
          onClick={() => {
            this.player.previousTrack().then(() => {
              console.log('Set to previous track!');
            });
          }}
        >Anterior</button>
        <button
          onClick={() => {
            this.player.togglePlay().then(() => {
              console.log('Toggled playback!');
            })
          }}
        >Play/Pause</button>
        <button onClick={() => {
          this.player.nextTrack().then(() => {
            console.log('Skipped to next track!');
          });
        }}>Siguiente</button>
        <p>-- Player End --</p>
      </Fragment>
    )
  }
}

export default Player;