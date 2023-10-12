import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../Contexts/CitiesContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  const { cityName, emoji, date, id, lat, lng } = city;
  const handleClick = (e) => {
    e.preventDefault();
    deleteCity(id);
  };
  return (
    <li>
      <Link
        className={`${
          currentCity.id === id ? styles[`cityItem--active`] : ``
        } ${styles.cityItem}`}
        to={`${id}?lat=${lat}&lng=${lng}`}
      >
        <img src={city.flagImg} className={styles.flag}>
          {emoji}
        </img>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button onClick={handleClick} className={styles.deleteBtn}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
