import ServiceProvider from "./ServiceProvider";

export default class PlayerService extends ServiceProvider {
  play(deviceId, tracks, position) {
    let url = `${this.domain}/v1/me/player/play`;
    let data = {};

    if (deviceId) {
      url = `${url}?device_id=${deviceId}`;
    }

    if (tracks) {
      data.uris = tracks.items.map(({ track }) => `spotify:track:${track.id}`);
    }

    if (position) {
      data.offset = { position };
    }

    return this.fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

  }

  getCurrent = () => {
    return this.fetch(`${this.domain}/v1/me/player`).then((res) => {
      if (res.device) {
        this.setCurrentDevice(res.device);
      }
      return Promise.resolve(res)
    }).catch(res => {
      console.log(res);
    });
  };

  changeDevice = (deviceId) => {
    return this.fetch(`${this.domain}/v1/me/player`, {
      method: 'PUT',
      body: JSON.stringify({ device_ids: [deviceId]})
    });
  };

  getDevices () {
    return this.fetch(`${this.domain}/v1/me/player/devices`, {
      method: 'GET',
    });
  }

  setDevice(deviceId) {
    localStorage.setItem('deviceId', deviceId);
  }

  getDevice() {
    const deviceId = localStorage.getItem('deviceId');
    return deviceId ? localStorage.deviceId : null;
  }

  setStatus(status) {
    localStorage.setItem('player', JSON.stringify(status));
  }

  getStatus() {
    const player = localStorage.getItem('player');
    return player ? JSON.parse(localStorage.player) : null;
  }


  setCurrentDevice(device) {
    localStorage.setItem('current', JSON.stringify(device));
  }

  getCurrentDevice() {
    const deviceId = localStorage.getItem('current');
    return deviceId ? JSON.parse(localStorage.current) : null;
  }
}