import React, { Component } from 'react'
import MiniFrame from './MiniFrame'
import AllAlbums from './AllAlbums'
import GoogleLogin from 'react-google-login'
import AllShows from './AllShows'
import CreateShowsSection from './CreateShowsSection'


class MainFrame extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: false,
            email: "", // user gmail address
            name: "", // user gmail first name
            imgUrl:"", // user gmail image
            showsWereCreatedFlag : false,
            numOfShows: 0
        }
        this.handleShowsCreation = this.handleShowsCreation.bind(this)
        this.renderLogIn = this.renderLogIn.bind(this)
        this.renderVotePage = this.renderVotePage.bind(this)
        this.renderAdminPage = this.renderAdminPage.bind(this)
        this.responseGoogle = this.responseGoogle.bind(this)
        this.loadShows = this.loadShows.bind(this)
        this.finish = this.finish.bind(this)
    }

    handleShowsCreation() { // handle the create shows click
        if(this.state.numOfShows === 0) {
            const url='https://tourbuilder.herokuapp.com/createShows'
            fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
            })
            .then((response) => response.json())
            .then((data) => data.statusCode === 200 ? this.setState({showsWereCreatedFlag: true}) : alert(data.Message))
            .catch(err => console.log(err))
        }
    }

    loadShows(numOfShows) {
        if(numOfShows > 0)
            this.setState({numOfShows: numOfShows})
    }


    responseGoogle (googleUser) { // handle the google login
        this.setState({ 
            isLoggedIn: true,
            email: googleUser.profileObj.email,
            name: googleUser.profileObj.givenName,
            imgUrl: googleUser.profileObj.imageUrl
        })
    }

    renderLogIn() {
        return (
            <div className='logIn'>
                <a id='logo' href='#'></a>
                <GoogleLogin
                clientId="1054644137362-9m3dqfuduiv8tovjj8fg9e74o3gqopgm.apps.googleusercontent.com"
                buttonText="Login with google"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                className='googleButton'
                id='login' />
            </div>
        )
    }

    renderVotePage() {
        return (
            <div className='mainFrame'>
                <MiniFrame id='whiteArea'>
                    <img alt='user gmail' id='userPhoto' src={this.state.imgUrl}></img>
                    <span id='helloMessage'>Hello {this.state.name}</span>
                    <AllAlbums userEmail={this.state.email}/>
                </MiniFrame>
                <MiniFrame id='brownArea'>
                    <AllShows amIadmin={false} onShowsLoad={this.loadShows}/>
                </MiniFrame>
            </div>
        )
    }

    finish() {
        this.setState({numOfShows: 0})
    }

    renderAdminPage() {
        return (
            <div className='mainFrame'>
                <MiniFrame id='whiteArea'>
                    <img alt='user gmail' id='userPhoto' src={this.state.imgUrl}></img>
                    <span id='helloMessage'>Hello {this.state.name}</span>
                    <CreateShowsSection numOfShows={this.state.numOfShows} onCreateShows={this.handleShowsCreation}/>
                </MiniFrame>
                <MiniFrame id='brownArea'>
                    <AllShows amIadmin={true} onShowsLoad={this.loadShows} onFinish={this.finish}/>
                </MiniFrame>
            </div>
        )
    }

    render() {
        if (this.state.isLoggedIn === true) {
            /* if you want to check the admin page you will need to insert here your gmail address */
            if (this.state.email === 'ziperfal123@gmail.com' || this.state.email === 'david.avigad@gmail.com')
                return this.renderAdminPage();
            else 
                return this.renderVotePage();
        }
        else
            return this.renderLogIn();
    }
}

export default MainFrame