import React, {Component, Fragment} from 'react';
import cookies from '../../utils/cookies';
import PlayerContext from '../../contexts/player-context';
import PlaylistContext from "../../contexts/playlist-context";

import PlayerService from "../../utils/PlayerService";
import PlaylistService from "../../utils/PlaylistService";


const Player = new PlayerService('https://api.spotify.com');
const Playlist = new PlaylistService('https://api.spotify.com');

function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s};

class CollaborativePlayer extends Component {
  /*
  player = {
    progress (in seconds),
    shuffle_state,
    repeat_state,
    is_playing
    track : {
      duration (in seconds)
      name,
      id,
    }
  }
  * */
  state = {
    inWindow: true,
    count: 0,
    player: null,
    loading: true,
  };
  processIntervalId = null;
  timeout = 20;
  player = null;

  componentDidMount() {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = cookies.getItem('accessToken');
      this.player = new Spotify.Player({
        name: 'Collaborative Playlist',
        getOAuthToken: cb => { cb(token); }
      });

      // Error handling
      this.player.addListener('initialization_error', ({ message }) => { console.error(message); });
      this.player.addListener('authentication_error', ({ message }) => { console.error(message); });
      this.player.addListener('account_error', ({ message }) => { console.error(message); });
      this.player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      this.player.addListener('player_state_changed', (state) => {
        if (state) {
          Player.setCurrentDevice(Player.getDevice());
          const player = this.formatStatus(state);
          this.setState({ player, inWindow: true });
          this.props.context.setTrack(player.track);
        } else {
          this.setState({ inWindow: false });
        }
      });

      // Ready
      this.player.addListener('ready', ({ device_id }) => {
        Player.setDevice({
          id: device_id,
          name: this.player._options.name,
        });
        clearInterval(this.processIntervalId);
        this.processIntervalId = window.setInterval(this.listener, 1000,this.timeout);
        this.setState({ loading: false });
      });
      // Connect to the player!
      this.player.connect();
    };

    this.fetchStatus();
  };

  fetchStatus = () => {
    Player.fetchStatus().then((res) => {
      if (res) {
        const { device } = res;
        this.props.context.setDevice(device);
        Player.setCurrentDevice(device);
        const player = this.formatStatus(res);
        this.setState({ player, inWindow: device.id === Player.getDevice().id });
        this.props.context.setTrack(player.track);
      }
    });
  };

  formatStatus = (state) => {
    const player = {};
    if (state.track_window) {
      const { track_window, shuffle, paused, repeat_mode, position, context} = state;
      player.progress = parseInt(position / 1000, 10);
      player.track = {
        id: track_window.current_track.id,
        name: track_window.current_track.name,
        duration: parseInt(track_window.current_track.duration_ms / 1000, 10),
        context: context.uri
      };
      player.shuffle_state = shuffle === 1;
      const repeatsModes = ['off', 'on', 'track'];
      player.repeat_state = repeatsModes[repeat_mode];
      player.is_playing = !paused;
    } else {
      //out status
      const { shuffle_state, repeat_state, is_playing, item, progress_ms, context } = state;
      player.progress = parseInt(progress_ms / 1000, 10);
      player.track = {
        id: item.id,
        name: item.name,
        duration: parseInt(item.duration_ms / 1000, 10),
        context: context ? context.uri : null,
      };
      player.shuffle_state = shuffle_state;
      player.repeat_state = repeat_state;
      player.is_playing = is_playing;
    }
    return player;
  };

  listener = (timeout) => {
    if (this.state.count % timeout === 0) {
      if (!this.state.inWindow) {
        this.fetchStatus();
      }
    }

    if(this.state.player && this.state.player.is_playing && this.state.player.progress < this.state.player.track.duration) {
      if ((this.state.player.track.duration - this.state.player.progress) < 2) {
        Player.fetchStatus().then((res) => {
          const player = this.formatStatus(res);
          if (player.is_playing && player.track.context === null) {
            Playlist.rehidratePlaylist().then((res) => {
              let playlist = Playlist.reorderPlaylist(res);
              const index = playlist.tracks.items.findIndex(item => item.track.id === player.track.id) + 1;
              playlist = Playlist.reorderPlaylist(playlist, index);
              this.props.setPlaylist(playlist);
              this.setState({ player, count: 18 });

              Player.play(Player.getCurrentDevice().id, playlist.tracks, index);
            });
          }
        });
      }
      this.setState({ player: {...this.state.player, progress : this.state.player.progress + 1 }});
    }


    this.setState({ count: this.state.count + 1 });

  };

  render() {
    return (
      <div>
        <p>--Live Reorder Begin--</p>
        <Fragment>
          {(!this.state.loading && this.state.player) ? (
            <p>{this.state.player.track.name}: {fmtMSS(this.state.player.progress)}/{fmtMSS(this.state.player.track.duration)}</p>
          ) : (
            <p>Cargando...</p>
          )}
        </Fragment>
        <p>--Live Reorder End--</p>
      </div>
    );
  }
}

export default props => (
  <PlayerContext.Consumer>
    {context => (
      <PlaylistContext.Consumer>
        {playlist => (<CollaborativePlayer {...props} context={context} playlist={playlist.playlist} setPlaylist={playlist.setPlaylist} />)}
      </PlaylistContext.Consumer>
    )}
  </PlayerContext.Consumer>
);



