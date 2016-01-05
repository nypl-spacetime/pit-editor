var React = require('react');
var ReactDOM = require('react-dom');

var NDJSONPane = require('./ndjson');
var JSONPane = require('./json');
var MapPane = require('./map');

module.exports = React.createClass({

  getInitialState: function() {
    return {
      data: {
        line: -1,
        pit: null
      }
    };
  },

  render: function() {
    return (
      <article>
        <NDJSONPane ref='ndjson' update={this.updatePIT} data={this.state.data} />
        <JSONPane ref='json' update={this.updatePIT} data={this.state.data} />
        <MapPane ref='map' update={this.updatePIT} data={this.state.data} />
      </article>
    );
  },

  updatePIT: function(data) {
    this.setState({
      data: data
    });
  }

});
