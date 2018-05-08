import React, { Component } from 'react';
import 'tachyons';
import logo from './logo.svg';

// displays site name for user
class Header extends Component {
	render() {
		return(
			<header className="App-header">
          		<img src={logo} className="App-logo" alt="logo" />
          		<h1 className="App-title">Welcome to IndieTalk</h1>
        	</header>
		);
	}	
}

export default Header;