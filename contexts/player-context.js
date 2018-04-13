import React, { Component, createContext } from 'react';

const PlayerContext = createContext();

export class PlayerProvider extends Component {
  state = {
    device: null,
  };

  setDevice = (device) => {
    this.setState({ device });
  };

  render() {
    return (
      <PlayerContext.Provider
        value={{
          state: this.state,
          setDevice: this.setDevice,
        }}>
        {this.props.children}
      </PlayerContext.Provider>
    );
  }
}

export default PlayerContext;