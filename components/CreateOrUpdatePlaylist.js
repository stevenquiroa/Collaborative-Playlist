import React, { Component, Fragment } from 'react';
import PlaylistService from '../utils/PlaylistService';
import PlayerService from "../utils/PlayerService";

const Playlist = new PlaylistService('https://api.spotify.com');
const Player = new PlayerService('https://api.spotify.com');

export default class CreateOrUpdatePlaylist extends Component {
  state = {
    type: null,
    name: '',
    playlists: [],
  };

  componentDidMount() {
    const playlist = Playlist.getPlaylist();
    if (typeof playlist.name !== 'undefined') {
      this.props.nextStep();
    }
  }

  createPlaylist = () => {
    Playlist.createPlaylist(`${this.state.name} - Collaborative`)
      .then((res) => {
        this.setState({playlist: res, form: false});
      })
      .catch(e => console.log(e));
  };

  selectPlaylist = ({ target }) => {
    const playlist = this.state.playlists.find(playlist => playlist.id === target.value);
    if (playlist) {
      Playlist.setPlaylist(Object.assign(playlist, { tracks: { items: [] }}));
      this.props.nextStep();
    }
  };

  render() {
    const { form, type } = this.state;
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