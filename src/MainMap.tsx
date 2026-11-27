import "./MainMap.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from "react-leaflet";
// import MarkerClusterGroup from "react-leaflet-cluster";
import useGeoLocation from "./useGeoLocation";
import {
  CircleMarker,
  Icon,
  // divIcon,
  // point, 
  type LatLngTuple
} from "leaflet";
import markerIcon from "./assets/marker-icon.png";

// create custom icon
const customIcon = new Icon({
  iconUrl: markerIcon,
  // iconUrl: require("./icons/placeholder.png"),
  iconSize: [38, 38] // size of the icon
});

// markers
type Markers = { id: number, geocode: LatLngTuple, popUp: string }[]
const markers: Markers = [
  {
    id: 1,
    geocode: [48.86, 2.3522],
    popUp: "Hello, I am pop up 1"
  },
  {
    id: 2,
    geocode: [48.85, 2.3522],
    popUp: "Hello, I am pop up 2"
  },
  {
    id: 3,
    geocode: [48.855, 2.34],
    popUp: "Hello, I am pop up 3"
  }
];

// eslint-disable-next-line
function GeoLocationCenter() {

  const location = useGeoLocation();
  const map = useMap();
  const center: LatLngTuple = [Number(location.coordinates.lat), Number(location.coordinates.lng)];
  map.setView(center, map.getZoom());

  return null;
}

const osmTiles = {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright',
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
}

// eslint-disable-next-line
const gmapsTiles = {
  attribution: "Google Maps",
  maxZoom: 20,
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
  url: "http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", // Terrain
  // url: "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}", // Satellite
  // url: "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", // Regular
}

const geoJSON: GeoJSON.GeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            22.4141638,
            40.0676205
          ],
          [
            22.4100825,
            40.0722013
          ],
          [
            22.4104453,
            40.0771287
          ],
          [
            22.4086314,
            40.0811884
          ],
          [
            22.4041873,
            40.0834784
          ],
          [
            22.3995618,
            40.086254
          ],
          [
            22.3992444,
            40.0894805
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "popupMsg": "Pop-up message for Point 1",
        "Point 1": "Value for Point 1"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          22.4139824,
          40.0677246
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "popupMsg": "Pop-up message for Point 2",
        "Point 2": "Value for Point 2"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          22.3991084,
          40.0895498
        ]
      }
    }
  ]
}

// Based on: https://codesandbox.io/p/sandbox/react-leaflet-with-marker-cluster-8kb8b0
export default function Map() {

  // Todo: Create (inclusive) map synopsis: "Create a 2-4 sentence summary describing what is in the map and what users can expect. This allows users to decide if they want to continue reading. It’s like a first glance at a visual map."

  const center: [number, number] = [40.0771287, 22.4104453];
  // const currentCenter: LatLngTuple = [Number(location.coordinates.lat), Number(location.coordinates.lng)]; // as LatLngTuple

  return (
    <MapContainer center={center} zoom={13}>

      <TileLayer {...osmTiles} />
      {/* <TileLayer { ...gmapsTiles }/> */}

      {/* <GeoLocationCenter /> */}

      <GeoJSON
        // pointToLayer={(feature, latlng) => {
        //   const circleMarkerOptions = { radius: 10, color: "black", fillColor: "orange" };
        //   return new CircleMarker(latlng, circleMarkerOptions);
        // }}
        onEachFeature={(feature, layer) => {
          const { popupMsg } = feature.properties;
          if (popupMsg) {
            layer.bindPopup(popupMsg);
          }

        }}
        data={geoJSON} />

      {markers.map((marker) => (
        <Marker key={marker.id} position={marker.geocode} icon={customIcon}>
          <Popup>{marker.popUp}</Popup>
        </Marker>
      ))}

    </MapContainer>
  );

}
