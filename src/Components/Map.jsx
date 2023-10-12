import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../Contexts/CitiesContext";
import { useGeoLocation } from "../hooks/useGeoLocation";
import Button from "./Button";
import useGetParams from "../hooks/useGetParams";

function Map() {
  const {
    isLoading: isLoadingPosition,
    location: geoLocationPosition,
    getPosition,
  } = useGeoLocation();

  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const [mapLat, mapLng] = useGetParams();
  useEffect(() => {
    if (geoLocationPosition) setMapPosition(geoLocationPosition);
  }, [geoLocationPosition]);
  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getPosition}>
        {isLoadingPosition ? `Loading...` : `Your Location`}
      </Button>

      <MapContainer
        className={styles.map}
        center={!mapLat || !mapLng ? [40, 0] : [mapLat, mapLng]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker key={city.id} position={[city.lat, city.lng]}>
            <Popup>
              {" "}
              <span>{city.emoji}</span> <span>{city.cityName}</span> {city.name}{" "}
            </Popup>
          </Marker>
        ))}
        <DetectClick />
        <ChangeCenter position={mapPosition} />
      </MapContainer>
    </div>
  );
}
const ChangeCenter = ({ position }) => {
  const map = useMap();
  map.setView(position);
  return null;
};
const DetectClick = () => {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
};
export default Map;
