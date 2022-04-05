import React, { Component } from 'react';

class MyMap extends Component {
  constructor(props) {
    super(props);
    this.onScriptLoad = this.onScriptLoad.bind(this)
  }

  createMap(){
    const map = new window.google.maps.Map(
      document.getElementById(this.props.id),
      this.props.options);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            map.setCenter(pos);
            map.setZoom(this.props.options.zoom)
          },
          () => {
          }
        );
      }
    this.props.onMapLoad(map)
  }

  onScriptLoad() {
    this.createMap()
  }

  componentDidUpdate(){
    this.createMap()
  }

  componentDidMount() {
    if (!window.google) {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = `https://maps.google.com/maps/api/js?key=keykeykeykey`;
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
      // Below is important. 
      //We cannot access google.maps until it's finished loading
      s.addEventListener('load', e => {
        this.onScriptLoad()
      })
    } else {
      this.onScriptLoad()
    }
  }

  render() {
    
    return (
      <div style={{ width: '100%', height: '100%' }} id={this.props.id} />
    );
  }
}

export default MyMap
