/**
 * View to add new users to site
 * 
 * Contributers:
 * - Casey Anderson,
 */

import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import { ACCOUNTS_URL } from './App';
import Login from './Login'

var request = new XMLHttpRequest();

// View to display register screen for adding new users to the program
class Register extends Component {
  constructor(props){
    super(props);
    this.state={
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      is_game_dev: false
    }
  }

  // callback for new user information to be handled by App.js 
    handleClick() {
      this.props.accountCallback({ 
        username: this.state.username,
        password: this.state.password,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        is_game_dev: this.state.is_game_dev
    })
    }

  // navigates view to the Login page
    goBackToLogin() {
      this.props.navigate(Login)
    }

  // componets to be displayed and used to obtain field values
  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
          <AppBar
          showMenuIconButton={false}
          title="Register for IndieTalk"
           />
           <TextField
             hintText="Enter your First Name"
             floatingLabelText="First Name"
             onChange = {(event,newValue) => this.setState({first_name:newValue})}
             />
           <br/>
           <TextField
             hintText="Enter your Last Name"
             floatingLabelText="Last Name"
             onChange = {(event,newValue) => this.setState({last_name:newValue})}
             />
           <br/>
           <TextField
             hintText="Enter your User Name"
             type="User Name"
             floatingLabelText="User Name"
             onChange = {(event,newValue) => this.setState({username:newValue})}
             />
           <br/>
           <TextField
             type = "password"
             hintText="Enter your Password"
             floatingLabelText="Password"
             onChange = {(event,newValue) => this.setState({password:newValue})}
             />
            <br/>
           <br/>
           <RaisedButton label="Register" primary={true} style={style} onClick={(event) => this.handleClick()}/>
           <div>
            <RaisedButton label="Back to Login" primary={true} style={style} onClick={ this.goBackToLogin.bind(this) }/>
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

export default Register;