import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainFrame from './components/MainFrame';
import * as serviceWorker from './serviceWorker';
import webFont from 'webfontloader'

webFont.load({
    google: {
        families: ['Oswald', 'sans-serif']
    }
})

ReactDOM.render(<MainFrame/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
