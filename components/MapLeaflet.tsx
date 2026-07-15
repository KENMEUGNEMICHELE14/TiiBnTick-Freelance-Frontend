import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Inline GeoJSON types to avoid importing the 'geojson' package (crashes Turbopack)
interface GeoJsonPosition extends Array<number> {}
interface GeoJsonGeometry {
  type: string
  coordinates: GeoJsonMultiLineStringCoordinates | GeoJsonPosition[]
}
interface GeoJsonMultiLineStringCoordinates extends Array<Array<GeoJsonPosition>> {}
interface GeoJsonFeature {
  type: 'Feature'
  geometry?: GeoJsonGeometry
  properties?: Record<string, unknown>
  routes?: Array<{ geometry?: { coordinates: GeoJsonPosition[] } }>
}

// Fix for default Leaflet icon not appearing correctly in Next.js
let L: any;
if (typeof window !== 'undefined') {
  L = require('leaflet');
}

type Props = {
  center?: LatLngExpression
  zoom?: number
  markers?: { position: LatLngExpression; label?: string; color?: string }[]
  route?: GeoJsonFeature | null
  className?: string
}

const createCustomIcon = (color: string, size: number = 18) => {
  if (typeof window === 'undefined') return undefined;

  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px; height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.35), 0 0 0 4px ${color}33;
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: ${size - 10}px; height: ${size - 10}px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}

const getCoordinates = (routeData: any): number[][] => {
  if (!routeData) return [];
  try {
    // Standard GeoJSON Feature
    if (routeData.type === 'Feature' && routeData.geometry && routeData.geometry.coordinates) {
      return routeData.geometry.coordinates;
    }
    // OSRM response format
    if (routeData.routes && routeData.routes[0]?.geometry?.coordinates) {
      return routeData.routes[0].geometry.coordinates;
    }
    // Direct geometry
    if (routeData.coordinates) {
      return routeData.coordinates;
    }
  } catch (e) {
    console.error("Error extracting coordinates", e);
  }
  return [];
};

// Component to automatically fit bounds to markers and route
function FitBounds({ markers, route }: { markers: { position: LatLngExpression }[], route?: any }) {
  const map = useMap();
  useEffect(() => {
    let points: any[] = markers.map(m => m.position);

    if (route) {
      const coords = getCoordinates(route);
      if (coords.length > 0) {
        points = [...points, ...coords.map((c: any) => [c[1], c[0]])];
      }
    }

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
    }
  }, [markers, route, map]);
  return null;
}

export default function MapLeaflet({ center = [5.33, -4.03], zoom = 12, markers = [], route = null, className }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className={`w-full h-full bg-gray-100 animate-pulse ${className || ''}`} />;

  const routeCoords = getCoordinates(route);
  const routeLatlngs = routeCoords.length > 0
    ? routeCoords.map((c: any) => [c[1], c[0]])
    : [];

  // Build a fallback straight line if no OSRM route
  const fallbackLine: [number, number][] = [];
  if (routeLatlngs.length === 0 && markers.length >= 2) {
    fallbackLine.push(
      markers[0].position as [number, number],
      markers[1].position as [number, number]
    );
  }

  return (
    <div className={`w-full h-full ${className || ''}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <FitBounds markers={markers} route={route} />

        {/* Transport Layer — CartoDB Voyager (road / transport focused) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Zoom control on the right */}
        <ZoomControlRight />

        {/* Fallback straight line (dashed) if no OSRM route */}
        {fallbackLine.length > 0 && (
          <Polyline
            positions={fallbackLine}
            pathOptions={{
              color: '#f97316',
              weight: 3,
              opacity: 0.6,
              dashArray: '10, 10',
            }}
          />
        )}

        {/* OSRM route (solid, prominent) */}
        {routeLatlngs.length > 0 && (
          <>
            {/* Route shadow / border */}
            <Polyline
              positions={routeLatlngs}
              pathOptions={{
                color: '#ffffff',
                weight: 8,
                opacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            {/* Route main line */}
            <Polyline
              positions={routeLatlngs}
              pathOptions={{
                color: '#f97316',
                weight: 5,
                opacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </>
        )}

        {/* Markers */}
        {markers.map((m, idx) => (
          <Marker
            position={m.position}
            key={idx}
            icon={m.color ? createCustomIcon(m.color) : undefined}
          >
            <Popup>{m.label || 'Point'}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

// Custom zoom control placed on the right side
function ZoomControlRight() {
  const map = useMap();
  useEffect(() => {
    const Zoom = L.control.zoom({ position: 'topright' });
    Zoom.addTo(map);
    return () => { map.removeControl(Zoom); };
  }, [map]);
  return null;
}