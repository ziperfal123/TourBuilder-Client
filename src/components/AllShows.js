import React, { Component } from 'react'
import Show from './Show'

var shouldRender = false

class AllShows extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shows: [],
            currentPlaylist:[], // represent the playlist of the selected show
            isShowRemove: false // 
        }
        this.addShow = this.addShow.bind(this)
        this.eachShow = this.eachShow.bind(this)
        this.handleShowchange = this.handleShowchange.bind(this)
        this.handleRemoveShow = this.handleRemoveShow.bind(this)
        this.handleRemoveAll = this.handleRemoveAll.bind(this)
    }

    componentDidMount() { // loading all shows
        const url = 'https://tourbuilder.herokuapp.com/getAllShows';
        fetch(url)
        .then((response) => response.json())
        .then((data) => {
            data.sort((a,b) => a.showId - b.showId).slice(0, data.length) // sorting by ID, means sort by the show date because the showId is incremental
            data.map(item => this.addShow({showId: item.showId, countryCode: item.countryCode, date: item.date, songs: item.songs}))
            this.props.onShowsLoad(this.state.shows.length)
        })
        .catch(err => console.log(err))
    }

    componentDidUpdate() { // this should provide the Ajax behavior in case of remove or in case the "Create shows" button was clicked
        var interval = () => {
            const url = 'https://tourbuilder.herokuapp.com/getAllShows'
            fetch(url)
            .then((response) => response.json())
            .then((data) => {
                data.sort((a,b) => a.showId - b.showId).slice(0, data.length)
                data.map(item => this.addShow({showId: item.showId, countryCode: item.countryCode, date: item.date, songs: item.songs}))
                this.props.onShowsLoad(this.state.shows.length)   
            })
            .catch(err => console.log(err))
        }
        if(this.state.shows.length === 0 || shouldRender) { // to prevent an infinite loop
            shouldRender = false
            setTimeout(interval, 1200) // waiting for the POST request of the first creation
        }
    }

    addShow({event = null, showId = null, countryCode = null, date = null, songs = null}) {
        this.setState(prevState => ({
            shows: [
                ...prevState.shows, {
                    showId: showId,
                    countryCode: countryCode,
                    date: date,
                    songs: songs
                }
            ]
        }))
    }

    handleShowchange(index) { // handle the change of the show selection
        this.setState({currentPlaylist: []})
        this.state.shows[index].songs.forEach(element => {
            const url = `https://tourbuilder.herokuapp.com/getSongDetailsById?songId=${element.songId}`
            fetch(url)
            .then((response) => response.json())
            .then((data) => this.setState({ currentPlaylist: [...this.state.currentPlaylist, data.songName] }))
            .catch(err => console.log(err))
        })
    }

    handleRemoveShow(showId, removeAll = false) { // handle the remove show click
        if(this.state.shows.length === 1) // give a sign to the parent to enable create show button
            this.props.onFinish()
        const url = `https://tourbuilder.herokuapp.com/removeShow`;
        let bodyRequest
        removeAll ? bodyRequest = `showId=${showId}&secretKey=${1234567890}&removeAll=${removeAll}` : bodyRequest = `showId=${showId}&secretKey=${1234567890}`
        fetch(url, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}, // <-- Specifying the Content-Type
            body: bodyRequest
        })
        .then((response) => response.json())
        .then((data) => {
            shouldRender = true
            this.setState({isShowRemove: !this.state.isShowRemove, shows: []})
        })
        .catch(err => console.log(err))
    }

    handleRemoveAll() { // handle the remove all click
        this.handleRemoveShow(null, true)
        this.props.onFinish() // give a sign to the parent to enable create show button
    }

    eachShow(show, index) {
        return (
            <Show amIadmin={this.props.amIadmin} showId={show.showId} key={index} index={index} onChange={this.handleShowchange} onRemoveShow={this.handleRemoveShow}>
                <span className='showDate'>{show.date}</span>
                <span className='showCountry'>{show.countryCode}</span>
            </Show>
        )
    }

    eachSong(song, index) {
         return (
             <span key={index} index={index} className='songsNames playListSongs'>{index+1}. {song}</span>
         )
    }

    render() {
        let style = {
            display: 'block'
        }
        if(this.state.shows.length === 0) // prevent the visability of the remove buttons to the fans page
            style.display = 'none'
        else if(!this.props.amIadmin)
            style.display = 'none'

        return (
            <div>
                <h1 id='tourh1'>Tour dates</h1>
                <div id='showsList'>
                    {this.state.shows.map(this.eachShow)}
                    <button id='removeAllButton' className='removeButton' onClick={this.handleRemoveAll} style={style}>Remove all</button>
                </div>
                <div id='playlist'>
                    <h2 id='playListTitle'>Show Playlist</h2>
                    {this.state.currentPlaylist.map(this.eachSong)}
                </div>
            </div>
        )
    }
}

export default AllShows