import ServiceProvider from "./ServiceProvider";

export default class PlayerService extends ServiceProvider {
  play(deviceId, tracks) {
    const uris = tracks.items.map(({ track }) => `spotify:track:${track.id}`);
    this.fetch(`${this.domain}/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({ uris }),
    });

  }
}