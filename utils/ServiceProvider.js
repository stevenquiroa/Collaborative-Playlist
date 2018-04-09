import cookies from "./cookies";

export default class ServiceProvider {
  constructor(domain) {
    this.domain = domain || 'http://localhost:5000';
  }

  _checkStatus(response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }

  fetch = (url, options) => {
    // performs api calls sending the required authentication headers
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    if (this.loggedIn()){
      headers['Authorization'] = 'Bearer ' + this.getToken()
    }

    return fetch(url, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json())
  };

  setToken(token){
    // Saves user token to localStorage
    cookies.setItem('accessToken', token);
  }

  getToken(){
    // Retrieves the user token from localStorage
    return cookies.getItem('accessToken');
  }

  loggedIn(){
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token
    // && !isTokenExpired(token) // handwaiving here
  }

  getProfile(){
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(localStorage.profile) : {}
  }

  setProfile(profile){
    // Saves profile data to localStorage
    localStorage.setItem('profile', JSON.stringify(profile))
  }
};