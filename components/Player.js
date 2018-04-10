import React, {Component, Fragment} from 'react';
import cookies from '../utils/cookies';
import PlayerService from "../utils/PlayerService";
import PlaylistService from "../utils/PlaylistService";

const Player = new PlayerService('https://api.spotify.com');
const Playlist = new PlaylistService('https://api.spotify.com');

class CollaborativePlayer extends Component {
  state = {
    current_track: null,
    deviceId: null,
  };

  componentDidMount () {
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
        this.setState({ deviceId: device_id });
      });

      // Connect to the player!
      this.player.connect();
    };
  }

  play = () => {
    if (this.state.current_track) {
      this.player.togglePlay().then(() => {
        console.log('Toggled playback!');
      })
    } else {
      console.log(Playlist);
      const playlist = Playlist.getPlaylist();
      const { deviceId } = this.state;
      if (deviceId && playlist && playlist.tracks.items.length > 0) {
        Player.play(this.state.deviceId, playlist.tracks);
      }
    }
  };

  render() {
    const { current_track, deviceId } = this.state;
    if (deviceId === null) {
      return (<p>Cargando...</p>);
    }
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
          onClick={this.play}
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

export default CollaborativePlayer;