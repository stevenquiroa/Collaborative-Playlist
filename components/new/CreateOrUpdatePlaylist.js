import React, { Component, Fragment } from 'react';
import PlaylistContext from '../../contexts/playlist-context';

import PlaylistService from '../../utils/PlaylistService';
import PlayerService from "../../utils/PlayerService";

const Playlist = new PlaylistService('https://api.spotify.com');
const Player = new PlayerService('https://api.spotify.com');

class CreateOrUpdatePlaylist extends Component {
  state = {
    type: null,
    name: '',
    playlists: [],
  };

  createPlaylist = () => {
    Playlist.createPlaylist(`${this.state.name} - Collaborative`)
      .then((playlist) => {
        this.props.context.setPlaylist(playlist);
        this.setState({ type: null });
      })
      .catch(e => console.log(e));
  };

  selectPlaylist = ({ target }) => {
    const item = this.state.playlists.find(playlist => playlist.id === target.value);
    if (item) {
      const playlist = Object.assign(item, { tracks: { items: [] }});
      Playlist.setPlaylist(playlist);
      this.props.context.setPlaylist(playlist);
      this.setState({ type: null });
      Playlist.rehidratePlaylist()
        .then((res) => {
          Playlist.setPlaylist(res);
          const playlist = Playlist.reorderPlaylist(res);
          this.props.context.setPlaylist(playlist);
        });
    }
  };

  render() {
    const { type } = this.state;
    return (
      <Fragment>
        <p>-- CreateOrUpdatePlaylist Begin --</p>
        {(type === 'create') && (
          <div>
            <p>Nombre: <input type="text" name="name" onChange={({target}) => {
              this.setState({name: target.value});
            }} value={this.state.name}/> - Collaborative</p>
            <button onClick={this.createPlaylist}>Crear</button>
            <button onClick={() => {
              this.setState({ type: null });
            }}>Cancel</button>
          </div>
        )}
        {(type === 'edit') && (
          <p>
            <select name="playlist" onChange={this.selectPlaylist} defaultValue="">
              <option key="nine" value="" disabled>Selecciona una playlist</option>
              {this.state.playlists.map(playlist => (
                <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
              ))}
            </select>

            <button onClick={() => {
              this.setState({ type: null });
            }}>Cancel</button>
          </p>
        )}
        {(type === null) && (
          <Fragment>
            <button
              onClick={() => {
                this.setState({type: 'create'});
              }}
            >Crear Lista Collaborativa</button>
            -
            <button
              onClick={() => {
                this.setState({type: 'edit'});
                Playlist.fetchPlaylists().then(res => {
                  const playlists = res.items.filter(playlist => playlist.collaborative === true);
                  this.setState({ playlists });
                });
              }}
            >Escoger una Lista Collaborativa</button>
          </Fragment>
        )}
        <p>-- CreateOrUpdatePlaylist End --</p>
      </Fragment>
    )
  }
}

export default props => (
  <PlaylistContext.Consumer>
    {context => <CreateOrUpdatePlaylist {...props} context={context} />}
  </PlaylistContext.Consumer>
);