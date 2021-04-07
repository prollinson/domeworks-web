import React, { useRef, useEffect, useState } from 'react';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
 
mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = 'pk.eyJ1IjoicGllcnNyIiwiYSI6ImNrbXJkdno3bTAwOG0ycG84NjVncHZhbGwifQ.juThbnk3LKZz1Vr7GmfsHA';

function TrailTemplate(props) {
  return (
    <div>
      <h1>Trail: {props.name}</h1>
      <p>{props.description}</p>

      <Map />
    </div>
  )
}

const Map = () => {
  const mapContainer = useRef();
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
   
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
    
    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });
    
    return () => map.remove();
    }, []);
    
    return (
    <div>
      <div className="sidebar">
      Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div className="map-container" ref={mapContainer} />
    </div>
    );
  };
   

export default TrailTemplate