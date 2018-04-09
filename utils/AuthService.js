import ServiceProvider from "./ServiceProvider";

export default class AuthService extends ServiceProvider{
  refreshToken = () => {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    return fetch('/auth/refresh', {
      headers,
      method: 'GET',
      credentials: 'include',
    })
    .then(this._checkStatus)
    .then(response => response.json())
    .then(response => {
      return Promise.resolve(response);
      });
  };

  logout(){
    // Clear user token and profile data from localStorage
    cookies.removeItem('accessToken');
    cookies.removeItem('refreshToken');
    cookies.removeItem('expiresIn');
    localStorage.removeItem('profile');
  }
}