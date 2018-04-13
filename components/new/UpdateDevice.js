import React, {Component, Fragment} from 'react';

import PlayerContext from '../../contexts/player-context';
import PlayerService from "../../utils/PlayerService";

const Player = new PlayerService('https://api.spotify.com');

class UpdateDevice extends Component {
  state = {
    type: null,
    devices: [],
  };

  onChange = ({ target }) => {
    const device = this.state.devices.find(device => device.id === target.value);
    if (device) {
      this.props.context.setDevice(device);
      Player.setCurrentDevice(device);
      Player.changeDevice(device.id);
    }
    this.setState({ type: null });
  };

  cancel = () => {
    this.setState({ type: null });
  };

  render() {
    const { type } = this.state;
    return (
      <div>
        {(type === null) && (
          <Fragment>
            <p>
              Dispositivo Actual:
              {this.props.context.state.device ? this.props.context.state.device.name : 'Ninguno'}
            </p>
            <button onClick={() => {
              Player.getDevices().then(({ devices }) => {
                this.setState({ devices });
              });
              this.setState({ type: 'change' });
            }}>Otro dispositivo</button>
          </Fragment>
        )}
        {(type === 'change') && (
          <p>
            {(this.state.devices.length > 0) ? (
              <select name="devices" id="devices" onChange={this.onChange} defaultValue="">
                <option value="" disabled>Seleccionar dispositivo</option>
                {this.state.devices.map(device => <option key={device.id} value={device.id}>{device.name}</option>)}
              </select>
            ): (
              <span>Cargando... </span>
            )}
            &nbsp;
            <button onClick={this.cancel}>Cancelar</button>
          </p>
        )}
      </div>
    );
  }
}

export default props => (
  <PlayerContext.Consumer>
    {context => <UpdateDevice {...props} context={context} />}
  </PlayerContext.Consumer>
);