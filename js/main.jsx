window.React = require('react');
window.ReactDOM = require('react-dom');

var App = require('./app');
var el = document.getElementById('app');

ReactDOM.render(<App />, el);
