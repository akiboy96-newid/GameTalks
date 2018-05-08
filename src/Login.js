/**
 * View for loging into the site
 * 
 * Contributers:
 * - Casey Anderson,
 * - Karan Singla
 */

import Register from './Register'
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';

// View to display login screen for user and collect user name and password
export default class Login extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: ""
        }
    }

    // sets username to field obtained from value of event
    changeUsername(event) {
        this.setState({
            username: event.target.value
        });
    }

    // sets password to field obtained from value of event
    changePassword(event) {
        this.setState({
            password: event.target.value
        });
    }

    // callback for username and password to be handled by App.js 
    handleLogin(event) {
        this.props.loginCallback({ 
            username: this.state.username,
            password: this.state.password
        })
    }

    // navigates view to the Register page
    goToRegister() {
        this.props.navigate(Register)
    }
    
    // componets to be displayed and used to obtain field values
    render() {
        return (
        <div>
        <MuiThemeProvider>
          <div>
          <AppBar
          showMenuIconButton={false}
          title="Login for IndieTalk"
           />
           <TextField
             hintText="Enter your User Name"
             floatingLabelText="User Name"
             onChange = {this.changeUsername.bind(this) }
             />
           <br/>
           <TextField
             hintText="Enter your Password"
             floatingLabelText="Password"
             type="password"
             onChange = {this.changePassword.bind(this) }
             />
           <br/>
           <br/>
            <RaisedButton label="Login" primary={true} style={style} onClick={this.handleLogin.bind(this)}/>
           <div>
            <RaisedButton label="Register" primary={true} style={style} onClick={ this.goToRegister.bind(this) }/>
            </div>
            </div>
            </MuiThemeProvider>
            </div>
        );
    }
}
const style = {
    margin: 15,
  };