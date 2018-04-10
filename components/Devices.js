import React, {Component, Fragment} from 'react';
import PlayerService from "../utils/PlayerService";

const Player = new PlayerService('https://api.spotify.com');

export default class Devices extends Component {
  state = {
    devices: [],
  };

  componentDidMount() {
    Player.getDevices().then(({ devices }) => {
      this.setState({ devices });
    });
  }

  onChange = ({ target }) => {
    const device = this.state.devices.find(device => device.id === target.value);
    this.props.onChange(device);
  };

  render() {
    const { devices } = this.state;
    return (
      <p>
        {(devices.length > 0) ? (
          <select name="devices" id="devices" onChange={this.onChange} defaultValue="">
            <option value="" disabled>Seleccionar dispositivo</option>
            {devices.map(device => <option key={device.id} value={device.id}>{device.name}</option>)}
          </select>
        ): (
          <span>Cargando... </span>
        )}
        <button onClick={this.props.onCancel}>Cancelar</button>
      </p>

    )
  }
}