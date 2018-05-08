/**
 * View to display current game and it's reviews
 * 
 * Contributers:
 * - Patrick Eddy
 * - Karan Singla
 */

import React, { Component } from 'react';
import axios from 'axios';
import Home from './Home'
import Games from './Games'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './Game.css';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar/AppBar';
import ActionHome from 'material-ui/svg-icons/action/home';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import moment from 'moment'

import { Card, CardMedia, CardText } from 'material-ui/Card';


import { ACCOUNTS_URL, REVIEWS_URL, BASE_URL, GAMES_URL } from './App';
import CardTitle from 'material-ui/Card/CardTitle';
import Dialog from 'material-ui/Dialog/Dialog';
import NewGame from './NewGame';

class Game extends Component {

	constructor(props) {
		super(props)

		this.state = {
			game: { ...props.game },
			reviews: [],
			addReview: "",
			didLike: true
		}
		this.fetchReviews();
	}

	clearReview() {
		this.setState({
			reviews: [],
			addReview: "",
			didLike: true
		});
	}

	fetchReviews() {
		var url = "https://indietalk-backend.herokuapp.com/games/" + this.state.game.game_id + "/reviews";
		axios.get(url)
			.then(reviewRes => {
				console.log(reviewRes)
				if (reviewRes.data.success) {
					const newReviews = [];
					Promise.all(reviewRes.data.data.reviews.map(review => {
						return fetch(`${ ACCOUNTS_URL}/${ review.account_id }`, { method: "GET" })
							.then(accountRes => accountRes.json())
							.then(accountRes => {
								if (accountRes.success) {
									// Got reviews, and account, add to state
									const reviewData = { 
										authorName: `${ accountRes.data.first_name } ${ accountRes.data.last_name }`,
										...review
									};
									console.log(reviewData)
									newReviews.push(reviewData)
								} else {
									console.error(accountRes.error.message)
								}
							});
						})
					)
					.then(() => {
						this.setState({
							reviews: newReviews
						})
					})
				}
			});
	}

	handleChange(event, newVal) {
		this.setState({
			addReview: newVal
		});
	};

	add() {
		const newReview = { account_id:this.props.accountId, did_like: this.state.didLike, comment: this.state.addReview }
		fetch("https://indietalk-backend.herokuapp.com/games/" + this.props.game.game_id + "/reviews", {
      		method: 'POST', 
      		body: JSON.stringify(newReview), 
      		headers: new Headers({
          		'Content-Type': 'application/json'
      		})
    	})
      .then((resp) =>resp.json())
      .then(res => { 
		console.log(res)
        if (res.success) {
			this.clearReview()
			this.fetchReviews()
		}
      })
      .catch(error => {
        console.error('Error:', error)
      });
	}

	showEditModal() {
		this.setState({
			isEditing: true
		})
	}

	dismissEditModal() {
		this.setState({
			isEditing: false
		})
	}

	editGame(game) {
		let dirty
		Object.entries(game).map(entry => dirty = this.state.game[`${ entry[0] }`] == entry[1])
		if (dirty) {
			this.doEdit(game)
		} else {
			this.dismissEditModal()
		}
	}

	doEdit(newGame) {
		fetch(`${ GAMES_URL }/${ this.state.game.game_id }`, {
      		method: 'PATCH', 
      		body: JSON.stringify({ owner: this.props.accountId, ...newGame }), 
      		headers: new Headers({
          		'Content-Type': 'application/json'
      		})
    	})
      .then((resp) =>resp.json())
      .then(res => { 
		console.log(res)
        if (res.success) {
			
			this.setState({
				isEditing: false,
				game: { game_id: this.state.game.game_id, owner: this.state.game.owner, ...newGame }
			})
		}
      })
      .catch(error => {
        console.error('Error:', error)
      });
	}

	deleteGameCallback(game) {
		if (game && game.game_id){
			fetch(`${GAMES_URL}/${ game.game_id }`, { method: "DELETE" })
				.then(res => res.json())
				.then(res => {
					if (res.success) {
						this.dismissEditModal()
						this.props.navigate(Home)
					} else {
						alert(`Couldn't delete ${ game.title }`)
						console.error(res)
					}
				})
				.catch(err => {
					alert(`Couldn't delete ${ game.title }`)
					console.error(err)
				})
		}
	}

	deleteReview(review) {
		fetch(`${ BASE_URL }/games/${ this.state.game.game_id }/reviews/${ review.review_id }`, { method: 'DELETE' })
      .then((resp) =>resp.json())
      .then(res => { 
		console.log(res)
        if (res.success) {
			this.setState({
				isEditing: false
			})
			this.fetchReviews()
		}
      })
      .catch(error => {
        console.error('Error:', error)
      });
	}

	handleLikeButtonClick(event, value) {

		console.log(value);
		let likeState = true
		if (value == "like"){
			likeState = true
		} else if (value == "dislike"){
			likeState = false
		}

		this.setState({
			didLike: likeState
		});
	}

	render() {
		return(
			<div>
				<MuiThemeProvider>
				<div>
					<AppBar
						iconElementLeft={ <ActionHome style={ { margin: 10, cursor: "pointer", color: "white" } } /> }
						onLeftIconButtonClick={ (event) => this.props.navigate(Home) }
						title={ this.state.game.title }
						iconElementRight={ this.renderEditButton() }
						onRightIconButtonClick={ (event) => this.showEditModal() }
						/>
					<Dialog
						title={`Edit ${ this.state.game.title }`}
						modal={false}
						open={this.state.isEditing}
						>
						 <NewGame
							game={ this.state.game }
							cancelCallback={ this.dismissEditModal.bind(this) }
							createGameCallback={ this.editGame.bind(this) }
							deleteGameCallback={ this.deleteGameCallback.bind(this) }
                        	/>
					</Dialog>
					<Card
						containerStyle={ { padding: 20, width:"75%", margin: "0 auto" } }>
						<CardMedia>
							<img src={ this.state.game.image } />
						</CardMedia>
						<CardText>
							<div className="left">
								<h1>{ this.state.game.title }</h1>
								<p><strong>Description</strong></p>
								<p>{ this.state.game.description }</p>
								<p><strong>Genre</strong></p>
								<p>{ this.state.game.genre }</p>
							</div>
						</CardText>
					</Card>
					{ this.renderWriteReview() }
					{ this.renderReviews() }
					</div>
					</MuiThemeProvider>
			</div>
		);
	}

	renderEditButton() {
		if (this.state.game.owner == this.props.accountId) {
			return <ModeEdit style={ { margin: 10, cursor: "pointer", color: "white" } } />
		}
	}

	renderWriteReview() {
		const ourReview = this.state.reviews
				.findIndex(rev => rev.account_id == this.props.accountId);
		if (ourReview == -1) {
			return (
				<div>
					<h2>Write Review</h2>
					<div className="create-review-container">
						<div>
							<div>
								<p>I { `${ this.state.didLike ? "liked" : "did not like"}` } { this.state.game.title }</p>
								<RadioButtonGroup
									name="liked"
									defaultSelected="like"
									onChange={ this.handleLikeButtonClick.bind(this) }
									>
									<RadioButton
										value="like"
										checkedIcon={ <ThumbUp /> }
										uncheckedIcon={ <ThumbUp /> }
										style={ { width: 50, margin: "0 auto", display: "inline-block" } }
										/>
									<RadioButton 
										value="dislike"
										checkedIcon={ <ThumbDown /> }
										uncheckedIcon={ <ThumbDown /> }
										style={ { width: 50, margin: "0 auto", display: "inline-block" } }
										/>
								</RadioButtonGroup>
							</div>
							<div>
								<TextField
									id="review-field"
									value={ this.state.addReview }
									floatingLabelText="Review"
									style={ { width: "50%", textAlign: "left" } }
									multiLine={true}
									onChange={ this.handleChange.bind(this) }
									/>
							</div>
						</div>
						<div>
						<RaisedButton 
							label="Add Review"
							style={ { width: "25%" } }
							primary={true}
							onClick={this.add.bind(this)}> 
						</RaisedButton>
						</div>
					</div>
				</div>
			)
		}
	}

	renderReviews() {
		const renderDeleteButton = review => (
			<p style={ { textAlign: "right" } }>
				<RaisedButton 
					label="Delete"
					secondary={true} 
					onClick={ (event) => this.deleteReview(review) } />
			</p>
		)

		const reviewsBlock = []
		if (this.state.reviews.length > 0){
			reviewsBlock.push(<h2>Reviews</h2>)
			this.state.reviews
				.sort((a,b) => moment(a.createdAt).isBefore(moment(b.createdAt)))
				.map( (review,i)  => (
				reviewsBlock.push(
					<div className="review-container" key={i}> 
						{ this.props.accountId == review.account_id ? renderDeleteButton(review) : '' }
						<p className="review">{ review.did_like ? "LIKE" : "DON'T LIKE" }</p>
						<p className="review"><strong>{ review.authorName }</strong></p>
						<p className="review">{ review.comment }</p>
					</div>
					)
				)
			)
		}
		return reviewsBlock
	}

}

const style = {
	margin: 15,
  };
export default Game;