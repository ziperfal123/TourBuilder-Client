import React, { Component } from 'react'
import Album from './Album'
import countriesObject from '../countriesObject.json' // This JSON will hold all countries in which the band decide to give the option to vote for  

const defaultImage = 'https://i.scdn.co/image/77eb7c17cafe550265ac9656051fe4e651a00d70' // the first album url - default


class AllAlbums extends Component { // This component represents a list of all band's albums
    constructor(props) {
       super(props) 
        this.state = {
            selectedPhotoUrl: defaultImage, // an image url which represent the selected album by the user, as a default will present the first album image
            albums: [], // includes all band's albums
            countries: [],
            currentAlbumSongs: [], // the songs of the selected album
            selectedCountry: 'Belgium, Brussels', // default country
            selectedSongsArr: [], // represents the the songs the user votes for
            isSuccessVote: false // a sign for a good form submission
        }
        this.addAlbumObject = this.addAlbumObject.bind(this)
        this.addCountryObject = this.addCountryObject.bind(this)
        this.eachAlbum = this.eachAlbum.bind(this)
        this.eachCountry = this.eachCountry.bind(this)
        this.changePhoto = this.changePhoto.bind(this)
        this.eachSong = this.eachSong.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCountryChange = this.handleCountryChange.bind(this)
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
        this.renderSuccessMessage = this.renderSuccessMessage.bind(this)
        this.renderForm = this.renderForm.bind(this)
    }

    componentDidMount() { // loading of all albums & album's songs & all countries
        const getAlbumsUrl = 'https://tourbuilder.herokuapp.com/getAlbumsByBandId?bandId=4gzpq5DPGxSnKTe4SA8HAU'
        fetch(getAlbumsUrl)
        .then(res=> res.json())
        .then(data => {
            data.albums.forEach(item => {
                var albumSongs = []
                const getSongsByAlbumUrl = `https://tourbuilder.herokuapp.com/getSongsByAlbumId?albumId=${item.albumId}`
                fetch(getSongsByAlbumUrl)
                .then(res=>res.json())
                .then(data=> data.songs.map(songItem => albumSongs.push(songItem)))
                .catch(err => console.error(err))
                this.addAlbumObject({albumName: item.albumName, albumId: item.albumId, albumImg: item.albumImg, songs: albumSongs})
            })
        })
        .catch(err => console.error(err))

        countriesObject.countries.map(item => this.addCountryObject({name: item.name, capital: item.capital}));
    }

    addAlbumObject({event = null, albumName = null, albumId = null, albumImg = null, songs = null}) {
        this.setState(prevState => ({
            albums: [
                ...prevState.albums, {
                    albumName: albumName,
                    albumId: albumId,
                    albumImg:albumImg,
                    songs: songs
                }
            ]
        }))
    }

    addCountryObject({event = null, name = null, capital = null, alpha2Code = null}) {
        this.setState(prevState => ({
            countries: [
                ...prevState.countries, {
                    name: name,
                    capital: capital,
                    alpha2Code:alpha2Code
                }
            ]
        }))
    }

    changePhoto(imgUrl, albumId) { // this function responsible to change the selected album image and to update the array which holds the selected album's songs
        let index = this.state.albums.findIndex(x => x.albumId === albumId)
        this.setState({
            selectedPhotoUrl: imgUrl,
            currentAlbumSongs: this.state.albums[index].songs
        })
    }

    eachAlbum(album, index) {
        return (
            <div key={`container${index}`}>
                <Album key={album.albumId} index={album.albumId} albumId={album.albumId} imgUrl={album.albumImg} onChange={this.changePhoto}>
                    <h2 className='albumName'>{album.albumName}</h2>
                </Album>
            </div>
        )
    }

    eachCountry(country, index) {
        return (
            <option className='options' key={index} index={index} capital={country.capital} value={country.capital + ', ' + country.name}>{country.name + ', ' + country.capital}</option>
        )
    }

    eachSong(song, index) {
            return ( // if he picked it already, then the checkbox will be checked
                <div className='songCheckbox' key={index}>                       
                    <input className='checkboxes' type='checkbox' onChange={this.handleCheckboxChange} checked={this.state.selectedSongsArr.some(item => item.songId === song.songId)} value={this.state.currentAlbumSongs[index].songId}/>
                    <label className='songsNames'>{song.songName}</label>
                </div>
            )
    }

    handleCheckboxChange(event) { // handle the click on the checkbox
        if(event.target.checked && this.state.selectedSongsArr.length >= 10) { // the user allow to vote for 10 songs
            alert("More than 10 songs")
            event.preventDefault()
        }
        else {
            let index = this.state.selectedSongsArr.findIndex(x => x.songId === event.target.value) // search the song in the selected songs
            var tempArr = this.state.selectedSongsArr.slice()
            if(index !== -1) // check if the selected song is already in the list
                tempArr.splice(index, 1);
            else 
                tempArr.push({songId: event.target.value})
            this.setState({selectedSongsArr: tempArr})
        }
    }

    handleSubmit(event) { // handle the form submission
        if(this.state.selectedSongsArr.length !== 10) { 
            alert('You have to pick exactly 10 songs')
            event.preventDefault();
        }
        else {
            var capital = this.state.selectedCountry.split(',')[0] // for catching only the capital city name
            const url='https://tourbuilder.herokuapp.com/saveForm'
            fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}, // <-- Specifying the Content-Type
                body: JSON.stringify({
                    userEmail: this.props.userEmail, 
                    capital: capital, 
                    countryCode: this.state.selectedCountry,
                    songs:this.state.selectedSongsArr 
                })
            })
            .then((response) => response.json())
            .then((data) => data.statusCode === 200 ? this.setState({isSuccessVote: true}) : alert(data.Comment) )
            .catch(err => console.log(err))
            event.preventDefault();
        }
    }

    handleCountryChange(event) { // handle the country selection
        this.setState({selectedCountry: event.target.value})
    }

    renderSuccessMessage() { // in case the vuser succeed to vote
        return (
            <div>
                <h1 id='successMessage'>Form sent successfully</h1>
            </div>
        )
    }

    renderForm() {
        return (
            <div id='albumsListContainer'>
                <img id='selectedAlbum' alt='album' src={this.state.selectedPhotoUrl}/>
                <h1 id='albumsTitle'>Albums List</h1>
                <div id='albumsList'>
                    {this.state.albums.map(this.eachAlbum)}
                </div>
                <form id='songsList' onSubmit={this.handleSubmit}>
                    <h1 id='countryTitle'>Select Country</h1>
                    <div className='dropDownCountries'>
                        <select id="dropDown" value={this.state.selectedCountry} onChange={this.handleCountryChange}>
                            {this.state.countries.map(this.eachCountry)}
                        </select>
                    </div>
                    <h1 id='songsTitle'>Select Songs</h1>
                    <div id='checkboxesDiv'>
                        {this.state.currentAlbumSongs.length > 0 ? this.state.currentAlbumSongs.map(this.eachSong) : <div></div>}
                    </div>
                    <input id='submitButton' type='submit' value='Submit'/>
                </form>
            </div>
        )
    }

    render() {
        return this.state.isSuccessVote ? this.renderSuccessMessage() : this.renderForm()
    }
}

export default AllAlbums