import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: '100%',
  height: '400px'
};

const Map = ({ longitude, latitude }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDqnxC0m1Dn-72jPGKlv8A6paSUohH8V88',
    libraries: ['places'],
  });

  const center = {
    lat: latitude,
    lng: longitude
  };

  if (loadError) {
    return <div>Lỗi khi tải Google Maps API</div>;
  }

  if (!isLoaded) {
    return <div>Đang tải bản đồ...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
    >
      <Marker position={center} />
    </GoogleMap>
  );
};

export default Map;
