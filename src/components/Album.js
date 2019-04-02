import React, { Component } from 'react'

class Album extends Component { // This component represents one band's album
    constructor(props) {
        super(props)
        this.showSongs = this.showSongs.bind(this)
    }

    showSongs() {
        this.props.onChange(this.props.imgUrl, this.props.albumId)  // will change album photo & show all album's songs
    }

    render() {
        return (
            <div className='album'>
                <button type='button' className='showSongsButton' onClick={this.showSongs}>Show songs</button>
                {this.props.children}
            </div>
        )
    }
}

export default Album