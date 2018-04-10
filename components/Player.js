import React, {Component, Fragment} from 'react';
import cookies from '../utils/cookies';

import Devices from './Devices';

import PlayerService from "../utils/PlayerService";
import PlaylistService from "../utils/PlaylistService";

const Player = new PlayerService('https://api.spotify.com');
const Playlist = new PlaylistService('https://api.spotify.com');

class CollaborativePlayer extends Component {
  state = {
    current_track: null,
    deviceId: null,
    player: null,
    currentPlayer: null,
    devices: [],
    changeDevice: false,
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
      this.player.addListener('player_state_changed', (player) => {

        Player.setStatus(player);
        if (player) {
          const currentPlayer = {
            id: Player.getDevice(),
            name: 'Collaborative Playlist Player',
          };
          Player.setCurrentDevice(currentPlayer);
          this.setState({ player, currentPlayer });
        } else {
          this.setState({ player });
        }

      });

      // Ready
      this.player.addListener('ready', ({ device_id }) => {
        this.setState({ deviceId: device_id });
        Player.setDevice(device_id);
      });

      // Connect to the player!
      this.player.connect();
    };
    Player.getCurrent().then((res) => {
      if (res.device) {
        this.setState({ currentPlayer: res.device });
      }
    });
  }

  play = () => {
    if (this.state.player && this.state.player.track_window.current_track) {
      this.player.togglePlay().then(() => {
        console.log('Toggled playback!');
      });
    } else {
      const playlist = Playlist.getPlaylist();
      const deviceId = this.state.deviceId;
      if (deviceId && playlist && playlist.tracks.items.length > 0) {
        Player.play(deviceId, playlist.tracks);
      }
    }
  };

  changeDevice = (device) => {
    this.setState({ changeDevice: false, currentPlayer: device });
    Player.changeDevice(device.id);
    Player.setCurrentDevice(device);
  };

  render() {
    const { player, deviceId } = this.state;
    if (deviceId === null) {
      return (<p>Cargando...</p>);
    }

    return (
      <Fragment>
        <p>-- Player Begin --</p>
        {(!this.state.changeDevice) ? (
          <p>
            Dispositivo Actual:
            {this.state.currentPlayer ? this.state.currentPlayer.name : 'Ninguno'}
            &nbsp;
            <button onClick={() => {
              this.setState({ changeDevice: true });
            }}>Otro dispositivo</button>
          </p>
        ): (
          <Devices onCancel={() => {
            this.setState({ changeDevice: false });
          }} onChange={this.changeDevice} />
        )}
        {player && (
          <p>
            Suena: {player.track_window.current_track.name}
            &nbsp;
            <button
              onClick={() => {
                this.player.previousTrack().then(() => {
                  console.log('Set to previous track!');
                });
              }}
            >Anterior</button>
            &nbsp;
            <button
              onClick={this.play}
            >Play/Pause</button>
            &nbsp;
            <button onClick={() => {
              this.player.nextTrack().then(() => {
                console.log('Skipped to next track!');
              });
            }}>Siguiente</button>
          </p>
        )}
        <p>-- Player End --</p>
      </Fragment>
    )
  }
}

export default CollaborativePlayer;