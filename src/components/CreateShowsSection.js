import React, { Component } from 'react'

const bandImageURL = 'https://bookingagentinfo.com/wp-content/uploads/2013/10/Coldplay-Contact-Information.jpg'

class CreateShowsSection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bandImg: bandImageURL, // admin page image
            numOfShows: this.props.numOfShows 
        }
        this.handleClick = this.handleClick.bind(this)
    }
    
    handleClick() { // handle the create show click
        this.props.onCreateShows()
    }

    render() {
        return (
            <div className='album'>
                    <img id='bandImg' alt='band' src={this.state.bandImg}/>
                    <h1 id="AdminTitle">Coldplay Tour-Builder</h1>
                    <button id='CreateListOfShowsButton' value='Create Tour' disabled={this.props.numOfShows > 0 ? true : false} onClick={this.handleClick}>Create Shows</button>
            </div>
        )
    }
}

export default CreateShowsSection