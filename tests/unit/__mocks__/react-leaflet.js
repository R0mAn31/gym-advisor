/**
 * Mock for react-leaflet
 */

import React from 'react';

// Mock the MapContainer component
const MapContainer = ({ children, center, zoom, style, ...props }) => {
  return <div data-testid="map-container">{children}</div>;
};

// Mock the TileLayer component
const TileLayer = ({ attribution, url }) => {
  return <div data-testid="tile-layer"></div>;
};

// Mock the Marker component
const Marker = ({ position, children }) => {
  return (
    <div data-testid="map-marker" data-position={JSON.stringify(position)}>
      {children}
    </div>
  );
};

// Mock the Popup component
const Popup = ({ children }) => {
  return <div data-testid="map-popup">{children}</div>;
};

// Mock the useMap hook
const useMap = jest.fn().mockReturnValue({
  setView: jest.fn(),
  fitBounds: jest.fn(),
  getZoom: jest.fn().mockReturnValue(13),
  getCenter: jest.fn().mockReturnValue({ lat: 0, lng: 0 })
});

// Mock the Circle component
const Circle = ({ center, radius, children }) => {
  return (
    <div data-testid="map-circle" data-center={JSON.stringify(center)} data-radius={radius}>
      {children}
    </div>
  );
};

module.exports = {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle
}; 