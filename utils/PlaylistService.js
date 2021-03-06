import ServiceProvider from "./ServiceProvider";

export default class PlaylistService extends ServiceProvider{
  setPlaylist(playlist){
    // Saves profile data to localStorage
    localStorage.setItem('playlist', JSON.stringify(playlist))
  }

  getPlaylist(){
    // Retrieves the profile data from localStorage
    const playlist = localStorage.getItem('playlist');
    return playlist ? JSON.parse(localStorage.playlist) : {}
  }

  createPlaylist(name, p=false, collaborative=true) {
    const {id} = this.getProfile();

    return this.fetch(`${this.domain}/v1/users/${id}/playlists`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        description: "",
        public: p,
        collaborative,
      }),
    }).then(res => {
      this.setPlaylist(res);
      return Promise.resolve(res);
    });
  }

  rehidratePlaylist() {
    const playlist = this.getPlaylist();

    return this.fetch(`${this.domain}/v1/users/${playlist.owner.id}/playlists/${playlist.id}/tracks?fields=items(added_by.id ,track(id,name))`, {
      method: 'GET',
    }).then(res => {
      const rehidratedPlaylist = Object.assign(playlist, { tracks: res });
      this.setPlaylist(rehidratedPlaylist);
      return Promise.resolve(rehidratedPlaylist);
    });
  }

  reorderPlaylist(playlist, from = 0) {
    const { tracks } = playlist;
    let items = [];
    const aux = tracks.items.slice(from).reduce(
      (accumulator, { added_by, track }, currentIndex) => {
        if (typeof accumulator.users[added_by.id] === 'undefined') {
          accumulator.users[added_by.id] = [{ ...track, previousIndex: currentIndex}];
          accumulator.adders.push(added_by.id);
        } else {
          accumulator.users[added_by.id].push({ ...track, previousIndex: currentIndex});
        }

        return accumulator;
      },
      {users: {}, adders: []}
    );

    while(aux.adders.length > 0) {
      aux.adders.forEach((adder, index) => {
        if (aux.users[adder].length > 0) {
          items.push({
            added_by: { id: adder },
            track: aux.users[adder].shift(),
          });
          if (aux.users[adder].length === 0) {
            aux.adders.splice(index, 1);
          }
        }
      });
    }

    if (from > 0) {
      items = [...playlist.tracks.items.slice(0, from), ...items];
    }

    playlist.tracks.items = items;
    return playlist;
  }

  fetchPlaylists() {
    const {id} = this.getProfile();

    return this.fetch(`${this.domain}/v1/users/${id}/playlists`, {
      method: 'GET',
    }).then(res => {
      return Promise.resolve(res);
    });
  }

  fetchPlaylistSongs(id) {
    const ownerId = this.getProfile().id;

    return this.fetch(`${this.domain}/v1/users/${ownerId}/playlists/${id}/tracks?fields=items(added_by.id ,track(id,name))`, {
      method: 'GET',
    }).then(res => {
      return Promise.resolve(res);
    });
  }
}