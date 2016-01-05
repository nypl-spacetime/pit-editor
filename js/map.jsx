var React = require('react');
var EventsMixin = require('./events');

var L = require('leaflet');
var fieldOfView = require('field-of-view');

L.Icon.Default.imagePath = 'img';

module.exports = React.createClass({
  mixins: [EventsMixin],


  getInitialState: function() {
    return {
      dragging: false
    };
  },

  render: function() {
    return (
      <section>
        <div id='map' />
      </section>
    );
  },

  componentDidMount: function() {
    var map = L.map('map').setView([52.37065, 4.90051], 18);

    map.on('drag', this.onDrag);
    this.enableEvents();

    map.on('dragstart', e => {
      this.setState({
        dragging: true
      })
    });

    map.on('dragend', e => {
      this.setState({
        dragging: false
      })
    });

    var tileLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      subdomains: 'abcd'
    }).addTo(map);

    var geoJsonLayer = L.geoJson().addTo(map);

    this.setState({
      map: map,
      tileLayer: tileLayer,
      geoJsonLayer: geoJsonLayer
    });
  },

  componentDidUpdate: function() {
    this.disableEvents();

    if (this.props.data.pit) {
      var feature = this.pitToFeature(this.props.data.pit);
      var fov = fieldOfView.fromFeature(feature, {
        nested: 'data',
        angle: 140
      });

      this.state.geoJsonLayer.clearLayers();
      this.state.geoJsonLayer.addData(fov);

      if (!this.state.dragging) {
        var point = this.props.data.pit.geometry.coordinates;
        this.state.map.setView([point[1], point[0]]);
      }
    }

    this.enableEvents();
  },

  pitToFeature: function(pit) {
    var properties = Object.assign({}, pit);
    delete properties.geometry;
    return {
      type: 'Feature',
      properties: properties,
      geometry: pit.geometry
    };
  },

  onDrag: function() {
    if (!this.allowEvents) {
      return;
    }

    var pit = this.props.data.pit;
    if (pit) {
      var center = this.state.map.getCenter();
      pit.geometry.coordinates = [
        center.lng,
        center.lat
      ];

      this.props.update({
        line: this.props.data.line,
        pit: pit
      });
    }
  }

});
