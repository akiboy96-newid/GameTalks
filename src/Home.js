/**
 * View for main display to show all games 
 * 
 * Contributers:
 * - Patrick Eddy
 * - Karan Singla
 */

import React from 'react'
import Login from './Login'
import Games from './Games'
import { ACCOUNTS_URL, GAMES_URL } from './App';
import AppBar from 'material-ui/AppBar/AppBar';
import ExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import PlaylistAdd from 'material-ui/svg-icons/av/playlist-add';
import Dialog from 'material-ui/Dialog'
import NewGame from './NewGame';
import { TOP_GAMES_URL, ACCOUNT_GAMES_URL } from './App';

// View to display user home screen for displaying all games the user can review or a Dev can edit
export default class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            myGames: [],
            topGames: [],
            allGames: [],
            username: "",
            name: "",
            isGameDev: false,
            showingNewGameDialog: false
        }
    }

    // call to gather user and games information
    componentDidMount() {
        this.fetchMyAccount()
        this.fetchGames()
    }

    // obtains users account from the database
    fetchMyAccount() {
        fetch(`${ ACCOUNTS_URL }/${ this.props.accountId }`, { method: "GET" })
			.then(res => res.json())
			.then(res => {
				if (res.success) {
					this.setState({
						username: res.data.username,
                        name: `${ res.data.first_name}  ${res.data.last_name }`,
                        isGameDev: res.data.is_game_dev
                    });
				} else { console.error(`Couldn't get account for id ${ this.props.accountId }`); }
			})
			.catch(err => {
				alert("Couldn't get user account.");
				console.error(err);
			});
    }

    // call to gather all current availble games the user can view
    fetchGames() {
        this.fetchMyGames()
        this.fetchTopGames()
        this.fetchAllGames()
    }

    // obtains all the current games attached to Dev from the database
    fetchMyGames() {
        fetch(ACCOUNT_GAMES_URL(this.props.accountId), { method: "GET" })
			.then(res => res.json())
			.then(res => {
				if (res.success) {
					this.setState({
						myGames: res.data.games
					});
				} else { console.error("Couldn't get my games."); }
			});
    }

    // obtains all the current top rated games from the database
    fetchTopGames() {
        fetch(TOP_GAMES_URL, { method: "GET" })
			.then(res => res.json())
			.then(res => {
				if (res.success) {
					this.setState({
						topGames: res.data.games.sort((a, b) => a.likes <= b.likes)
					});
				} else { console.error("Couldn't get top games."); }
			});
    }

    // obtains all the current games from the database
    fetchAllGames() {
        fetch(GAMES_URL, { method: "GET" })
			.then(res => res.json())
			.then(res => {
				if (res.success) {
					this.setState({
						allGames: res.data.games
					});
				} else { console.error("Couldn't get all games."); }
			});
    }

    // displays add new game window
    showAddNewGame() {
        this.setState({ showingNewGameDialog: !this.state.showingNewGameDialog })
    }

    // close add new game window
    dismissAddNewGame() {
        this.setState({
            showingNewGameDialog: false
        })
    }

    // creates game in database and attaches it to the current user
    createGame(game) {
        fetch(GAMES_URL, { 
            method: "POST", 
            body: JSON.stringify({
                owner: this.props.accountId,
                ...game
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .then(res => res.json())
            .then(res => {
                this.dismissAddNewGame()
                if (res.success) {
                    this.fetchGames()
                } else {
                    alert("Couldn't create game.")    
                    console.error(res)
                }
            })
            .catch(err => {
                alert("Couldn't create game.")
                console.error(err)
            })
    }

    // componets to display all current availble games along with the Devs current games and option to add new game
    render() {
        return (
            <div>
                <AppBar
                    iconElementLeft={ <ExitToApp style={ { margin: 10, cursor: "pointer", color: "white" } } /> }
                    onLeftIconButtonClick={ (event) => this.props.navigate(Login) }
                    title={ this.renderTitle() }
                    iconElementRight={ <PlaylistAdd style={ { margin: 10, cursor: "pointer", color: "white" } } /> }
                    onRightIconButtonClick={ (event) => this.showAddNewGame() }
                    />

                <Dialog
                    title="Add New Game"
                    open={ this.state.showingNewGameDialog }
                    modal={false}
                    >
                    <NewGame
                        cancelCallback={ this.dismissAddNewGame.bind(this) }
                        createGameCallback={ this.createGame.bind(this) }
                        />
                </Dialog>
                <Games 
                    myGames={ this.state.myGames }
                    topGames={ this.state.topGames }
                    allGames={ this.state.allGames }
                    isGameDev={ this.state.isGameDev }
                    accountId={ this.props.accountId }
                    navigate={ this.props.navigate }
                    />
            </div>
        )
    }

    // returns the name and username of current user
    renderTitle() {
        return `${this.state.name} (${ this.state.username })`
    }
}