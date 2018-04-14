import React, {Component, Fragment} from 'react';
import PlaylistContext from "../../contexts/playlist-context";
import PlayerContext from "../../contexts/player-context";

import CreateOrUpdatePlaylist from './CreateOrUpdatePlaylist';

import PlaylistService from "../../utils/PlaylistService";
import PlayerService from "../../utils/PlayerService";

const Playlist = new PlaylistService('https://api.spotify.com');
const Player = new PlayerService('https://api.spotify.com');

class CollaborativePlaylist extends Component {
  componentDidMount() {
    const playlist = Playlist.getPlaylist();
    if (typeof playlist.name !== 'undefined') {
      this.props.context.setPlaylist(playlist);
      if (playlist.notSync !== true) {
        Playlist.rehidratePlaylist()
          .then((res) => {
            const playlist = Playlist.reorderPlaylist(res);
            this.props.context.setPlaylist(playlist);
          });
      }
    }
  }

  playSong = (offset) => {
    return () => {
      const playlist = this.props.context.state.playlist;
      const currentDevice = Player.getCurrentDevice();
      const deviceId = (currentDevice) ? currentDevice.id : Player.getDevice().id;
      if (deviceId && playlist && playlist.tracks.items.length > 0) {
        Player.play(deviceId, playlist.tracks, offset);
      }
    };
  };

  render() {
    const { playlist } = this.props.context.state;
    const trackId = (this.props.track && this.props.track.context === null) ? this.props.track.id : null;
    return (
      <div>
        {(playlist) ? (
          <Fragment>
            <h1>{playlist.name}</h1>
            {(playlist.tracks.items.length > 0) && (
              <ul>
                {playlist.tracks.items.map(({ added_by, track }, index)=> (
                  <li key={index}>{track.name} - {added_by.id} -
                    <a onClick={this.playSong(index)}>
                      {(trackId === track.id ) ? 'Reproduciendo' : 'Seleccionar' }
                    </a>

                  </li>
                ))}
              </ul>
            )}
            <p style={{
              position: 'fixed',
              bottom: 0,
              width: '100%',
            }}>Link para compartir:
              <span>{playlist.external_urls.spotify}</span>
            </p>
          </Fragment>
        ) : (<CreateOrUpdatePlaylist />)}
      </div>
    );
  }
}

export default props => (
  <PlaylistContext.Consumer>
    {playlist => (
    <PlayerContext.Consumer>
      {context => <CollaborativePlaylist {...props} context={playlist} track={context.state.track} />}
    </PlayerContext.Consumer>
    )}
  </PlaylistContext.Consumer>
);