/**
 * View for adding new games to site
 * 
 * Contributers:
 * - Patrick Eddy
 * - Karan Singla
 */

import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField';

// View to display new game screen for adding new games to the program
export default class NewGame extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: (props.game ? props.game.title : ""),
            description: (props.game ? props.game.description: ""),
            genre: (props.game ? props.game.genre : ""),
            image: (props.game ? props.game.image : "")
        }
    }

    // componets to be displayed and used to obtain field values
    render() {
        return (
            <div className="new-game-container">
            <TextField
             hintText="Game title"
             floatingLabelText="Game title"
             onChange = {(event,newValue) => this.setState({title:newValue})}
             value={ this.state.title }
             />
           <br/>
           <TextField
             fullWidth={true}
             rowsMax={3}
             hintText="Description"
             floatingLabelText="Description"
             multiLine={true}
             onChange = {(event,newValue) => this.setState({description:newValue})}
             value={ this.state.description }
             />
           <br/>
           <TextField
             hintText="Genre"
             floatingLabelText="Genre"
             onChange = {(event,newValue) => this.setState({genre:newValue})}
             value={ this.state.genre }
             />
           <br/>
           <TextField
             hintText="Picture URL (optional)"
             floatingLabelText="Picture URL (optional)"
             onChange = {(event,newValue) => this.setState({image:newValue})}
             value={ this.state.image }
             />
           <br/>
           <RaisedButton
                label={ `${ this.props.game ? "Edit" : "Add" } ${ this.state.title }` }
                primary={true}
                onClick={ (event)=> this.props.createGameCallback({ 
                        title: this.state.title, 
                        description: this.state.description,
                        genre: this.state.genre,
                        image: this.state.image
                    }) 
                }
                />
            <RaisedButton
                label="Cancel"
                onClick={ (event)=> this.props.cancelCallback() }
                />
            { this.renderDeleteButton() }
           </div>
        )
    }
    
    // component to delete games from the program
    renderDeleteButton() {
        if (this.props.game) {
            return (
                <RaisedButton 
                    label="Delete"
                    secondary={true}
                    onClick={ (event) => this.props.deleteGameCallback(this.props.game) }
                    />
            )
        }
    }
}