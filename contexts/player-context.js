import React, { Component, createContext } from 'react';

const PlayerContext = createContext();

export class PlayerProvider extends Component {
  state = {
    device: null,
    track: null,
  };

  setDevice = (device) => {
    this.setState({ device });
  };

  setTrack = (track) => {
    this.setState({ track });
  };

  render() {
    return (
      <PlayerContext.Provider
        value={{
          state: this.state,
          setDevice: this.setDevice,
          setTrack: this.setTrack,
        }}>
        {this.props.children}
      </PlayerContext.Provider>
    );
  }
}

export default PlayerContext;