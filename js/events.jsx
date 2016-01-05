var React = require('react');

module.exports = {
  allowEvents: true,
  shouldComponentUpdate: function() {
    return this.allowEvents;
  },

  disableEvents: function() {
    this.allowEvents = false;
  },

  enableEvents: function() {
    setTimeout(function() {
      this.allowEvents = true;
    }.bind(this), 60);
  }

};
