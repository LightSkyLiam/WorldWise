import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <img className={styles.flagImg} src={country.flagImg} />
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
