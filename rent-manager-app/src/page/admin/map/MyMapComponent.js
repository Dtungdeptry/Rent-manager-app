import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: '100%',
  height: '400px',
};

const Map = ({ latitude, longitude }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDqnxC0m1Dn-72jPGKlv8A6paSUohH8V88",
    libraries: ['geometry', 'drawing', 'places'],
  });

  if (!latitude || !longitude) {
    return <div>Error: Invalid latitude or longitude.</div>;
  }

  const center = {
    lat: latitude,
    lng: longitude,
  };

  if (loadError) {
    return <div>Lỗi tải Google Maps API</div>;
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
