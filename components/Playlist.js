import React, { Component, Fragment } from 'react';
import PlaylistService from '../utils/PlaylistService';

const Playlist = new PlaylistService('https://api.spotify.com');

class CollaborativePlaylist extends Component {
  state = {
    form: false,
    name: '',
    playlist: {},
  };

  componentDidMount() {
    const playlist = Playlist.getPlaylist();
    if (typeof playlist.name !== 'undefined') {
      this.setState({ playlist });
      Playlist.rehidratePlaylist()
        .then((playlist) => {
          this.setState({ playlist });
        });
    }
  }

  createPlaylist = () => {
    Playlist.createPlaylist(`${this.state.name} - Collaborative`)
      .then((res) => {
        this.setState({ playlist: res, form: false });
      })
      .catch(e => console.log(e));
  };


  render() {
    const { form, playlist } = this.state;
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
                {playlist.tracks.items.map(({ added_by, track })=> (
                  <li key={`${track.id}:${added_by.id}`}>{track.name} - {added_by.id}</li>
                ))}
              </ul>
            )}
          </Fragment>
        )}

        <p>-- Playlist End --</p>
      </Fragment>
    );
  }
}

export default CollaborativePlaylist;