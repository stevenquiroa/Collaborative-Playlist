import ServiceProvider from "./ServiceProvider";

export default class PlayerService extends ServiceProvider {
  play(deviceId, tracks, position=0) {
    const uris = tracks.items.map(({ track }) => `spotify:track:${track.id}`);
    this.fetch(`${this.domain}/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({ uris, offset: { position } }),
    });

  }

  setDevice(deviceId) {
    localStorage.setItem('deviceId', deviceId);
  }

  getDevice() {
    const deviceId = localStorage.getItem('deviceId');
    return deviceId ? deviceId : null;
  }

  setCurrentDevice(deviceId) {
    localStorage.setItem('currentDeviceId', deviceId);
  }

  getCurrentDevice() {
    const deviceId = localStorage.getItem('currentDeviceId');
    return deviceId ? deviceId : null;
  }
}