/**
 * App to start the views and help navigate between them
 * 
 * Contributers:
 * - Casey Anderson,
 * - Patrick Eddy
 * - Karan Singla
 */

import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import Login from './Login'
import Header from './Header';
import 'tachyons';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export const BASE_URL = "https://indietalk-backend.herokuapp.com";
const LOGIN_URL = `${ BASE_URL }/login`;
export const GAMES_URL = `${ BASE_URL }/games`;
export const REVIEWS_URL = `${ BASE_URL }/reviews`;
export const ACCOUNTS_URL = `${ BASE_URL }/accounts`;
export const ACCOUNT_GAMES_URL = (accountId) => `${ BASE_URL }/accounts/${ accountId }/games`;
export const TOP_GAMES_URL = `${ BASE_URL }/top/games`;

// class to handle apps generation and view states
class App extends Component {  
  constructor() {
    super()
    this.state = {
      activePage: Login,
      activePageProps: {},
      isLoggedIn : false,
      accountId: 0
    };
  }

  // changes current view
  navigate(page, props) {
    this.setState({
      activePage: page,
      activePageProps: props
    })
    window.scrollTo(0, 0)
  }

  // handles communicating with database from Login view
  loginCallback({ username, password }) {
    fetch(LOGIN_URL, {
      method: 'POST', 
      body: JSON.stringify({ username, password }), 
      headers: new Headers({
          'Content-Type': 'application/json'
      })
    })
      .then((resp) =>resp.json())
      .then(res => { 
        if (res.success) {
          this.setState({
            accountId: res.account_id
          });
          this.navigate(Home)

        } else {
          alert(`Couldn't login\n\n${ res.error.message }`)
        }
      })
      .catch(error => {
        console.error('Error:', error)
      });
  }

  // handles communicationg with database from register view
  accountCallback({ username, password, first_name, last_name, is_game_dev }) {
    fetch(ACCOUNTS_URL, {
      method: 'POST', 
      body: JSON.stringify({ username, password, first_name, last_name, is_game_dev }), 
      headers: new Headers({
          'Content-Type': 'application/json'
      })
    })
      .then((resp) =>resp.json())
      .then(res => { 
        if (res.success) {
          this.setState({
            accountId: res.account_id
          });
          this.navigate(Login)

        } else {
          alert(`Couldn't register\n\n${ res.error.message }`)
        }
      })
      .catch(error => {
        console.error('Error:', error)
      });
  }
  
  // returns app and methods
  render() {
    return (
      <div className="App">
        <MuiThemeProvider>
          <this.state.activePage 
              loginCallback={ this.loginCallback.bind(this) }
              accountCallback={ this.accountCallback.bind(this) }
              accountId={ this.state.accountId}
              navigate={ this.navigate.bind(this) }
              { ...this.state.activePageProps }
              />
            </MuiThemeProvider>
      </div>
    );
  }
}

export default App;


