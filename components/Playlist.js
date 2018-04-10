import React, { Component, Fragment } from 'react';
import PlaylistService from '../utils/PlaylistService';
import PlayerService from "../utils/PlayerService";

const Playlist = new PlaylistService('https://api.spotify.com');
const Player = new PlayerService('https://api.spotify.com');

class CollaborativePlaylist extends Component {
  state = {
    form: false,
    name: '',
    playlist: {},
    reordered: false,
  };

  componentDidMount() {
    const playlist = Playlist.getPlaylist();
    if (typeof playlist.name !== 'undefined') {
      this.setState({ playlist });
      if (playlist.notSync !== true) {
        Playlist.rehidratePlaylist()
          .then((playlist) => {
            this.setState({ playlist });
          });
      }
    }
  }

  createPlaylist = () => {
    Playlist.createPlaylist(`${this.state.name} - Collaborative`)
      .then((res) => {
        this.setState({ playlist: res, form: false });
      })
      .catch(e => console.log(e));
  };

  reorderPlaylist = () => {
    const playlist = Playlist.getPlaylist();
    const reoderedPlaylist = Playlist.reorderPlaylist(playlist);
    this.setState({ playlist: reoderedPlaylist, reordered: true });
  };

  savePlaylist = () => {
    Playlist.setPlaylist({ ...this.state.playlist, notSync: true });
    this.setState({ reordered: false });
  };

  playSong = (offset) => {
    return () => {
      const playlist = Playlist.getPlaylist();
      const deviceId = Player.getCurrentDevice();
      if (deviceId && playlist && playlist.tracks.items.length > 0) {
        Player.play(deviceId, playlist.tracks, offset);
      }
    };
  };

  render() {
    const { form, playlist, reordered } = this.state;
    return (
      <Fragment>
        <p>-- Playlist Begin --</p>
        {(form) ? (
          <div>
            <p>Nombre: <input type="text" name="name" onChange={({ target }) => {
              this.setState({ name: target.value });
            }} value={this.state.name} /> - Collaborative</p>
            <button onClick={this.createPlaylist}>Crear</button>
          </div>
        ) : (
          <button
            onClick={() => {
             this.setState({ form: true });
            }}
          >Crear Lista Collaborativa</button>
        )}

        {(typeof playlist.name !== 'undefined') && (
          <Fragment>
            <h1>{playlist.name}</h1>
            <p>Link para compartir:</p>
            <pre>
              {playlist.external_urls.spotify}
            </pre>
            {(playlist.tracks.items.length > 0) && (
              <ul>
                {playlist.tracks.items.map(({ added_by, track }, index)=> (
                  <li key={index}>{track.name} - {added_by.id} - <a onClick={this.playSong(index)}>Seleccionar</a></li>
                ))}
              </ul>
            )}
          </Fragment>
        )}

        <p>-- Playlist End --</p>
        <p>-- Playlist Action Buttons Begin --</p>
        {(reordered) ? (
          <Fragment>
            <button onClick={this.savePlaylist}>Guardar en local</button>
          </Fragment>

        ) : (
          <Fragment>
            <button onClick={this.reorderPlaylist}>Reordenar</button>
          </Fragment>
        )}


        <p>-- Playlist Action Buttons End --</p>
      </Fragment>
    );
  }
}

export default CollaborativePlaylist;