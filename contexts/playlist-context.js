import React, { Component, createContext } from 'react';

const PlaylistContext = createContext();

export class PlaylistProvider extends Component {
  state = {
    playlist: null,
  };

  setPlaylist = (playlist) => {
    this.setState({ playlist });
  };

  render() {
    return (
      <PlaylistContext.Provider
        value={{
          state: this.state,
          setPlaylist: this.setPlaylist,
        }}>
        {this.props.children}
      </PlaylistContext.Provider>
    );
  }
}

export default PlaylistContext;
