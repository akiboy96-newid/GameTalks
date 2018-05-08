/**
 * View to display current lists of games
 * 
 * Contributers:
 * - Casey Anderson,
 * - Patrick Eddy
 * - Karan Singla
 */

import React, { Component } from 'react';
import './Games.css';
import axios from 'axios';
import Game from './Game'

// View to display new game screen for adding new games to the program
class Games extends Component {
	constructor(props) {
		super();
		this.state = {
			username: "", 
			name: "",
			gameIsClicked: false,
			gameid: ""
		};
	}	

	// displays games information
	getGameItems(games, showRank) {
		let runningCount = 0;
		return (
			games.map( (game, i) => {
				if (game) {
					return (
						<div 
							className="game-item" key={ i } 
							onClick={ this.gameItemClicked.bind(this, game.game_id, game) }
							style={ { background: `no-repeat url('${ game.image }') center center`, backgroundSize: "cover" } }
						>
							<div
								className="game-overlay">
								<h3 style={{ color: "white" }}>{ showRank ? `${ ++runningCount }. ` : '' }{ game.title }</h3>
							</div>
						</div>	
					)
				}
			})
		);
	}
	
	// navigate to view of the game user clicks on
	gameItemClicked(gameId, game) {
		this.props.navigate(Game, { gameId, game })
	}

	// generates display of current Devs games
	renderOurGames() {
		if (this.props.myGames && this.props.myGames.length > 0) {
			return (
				<div>
					<div className="list my-games">
						<h1>My Games</h1>
						{ this.getGameItems(this.props.myGames) }
					</div>
				</div>
			)
		}
	}

	// generates display of current top rated games
	renderTopGames() {
		return (
			<div className="list">
				<h1>Top Rated Games</h1>
				{ this.getGameItems(this.props.topGames, true) }
			</div>
		)
	}

	// generates display of all current games
	renderAllGames() {
		return (
			<div className="list">
				<h1>All Games</h1>
				{ this.getGameItems(this.props.allGames) }
			</div>
		)
	}

	// returns all displays
	render() {
		return (
			<div>
				<div>
					{ this.renderOurGames() }
					{ this.renderTopGames() }
					{ this.renderAllGames() }
				</div>
			</div>
		)
	}
}

export default Games;