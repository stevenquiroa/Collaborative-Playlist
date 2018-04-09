import ServiceProvider from "./ServiceProvider";

export default class PlaylistService extends ServiceProvider{
  setPlaylist(playlist){
    // Saves profile data to localStorage
    localStorage.setItem('playlist', JSON.stringify(playlist))
  }

  getPlaylist(){
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('playlist');
    return profile ? JSON.parse(localStorage.playlist) : {}
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
}