import React, { Component } from 'react'

class Show extends Component {
    constructor(props) {
        super(props)
        this.showSongs = this.showSongs.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
    }

    showSongs() { // handle the show songs click
        this.props.onChange(this.props.index)
    }

    handleRemove() { // handle the remove click
        this.props.onRemoveShow(this.props.showId)
    }

    render() {
        let style = {
            display: 'none'
        }
        if(this.props.amIadmin)
            style.display = 'block'
            
        return (
            <div className='shows'>
                {this.props.children}
                <button className='removeButton' onClick={this.handleRemove} style={style}>Remove</button>
                <button className='displayShowSongsButton' onClick={this.showSongs}>Playlist</button>
            </div>
        )
    }
}

export default Show