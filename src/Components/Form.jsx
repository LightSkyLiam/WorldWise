// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useReducer } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import useGetParams from "../hooks/useGetParams";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../Contexts/CitiesContext";
import { useNavigate } from "react-router-dom";
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

const initialState = {
  cityName: "",
  country: "",
  notes: "",
  isLoadingGeoCoding: false,
  isErrorGeoCoding: "",
  flagImg: "",
  date: new Date(),
};

function Form() {
  const reducer = (state, action) => {
    switch (action.type) {
      case `GeoCoding/start`:
        return { ...state, isErrorGeoCoding: "", isLoadingGeoCoding: true };
      case `rejected`:
        return {
          ...state,
          isErrorGeoCoding: action.payLoad,
          isLoadingGeoCoding: false,
        };
      case `GeoCoding/finish`:
        return {
          ...state,
          isLoadingGeoCoding: false,
          cityName: action.payLoad.cityName,
          country: action.payLoad.country,
          flagImg: action.payLoad.flagImg,
        };
      case `setDate`:
        return { ...state, date: action.payLoad };
      case `setCityName`:
        return { ...state, cityName: action.payLoad };
      case `setNotes`:
        return { ...state, notes: action.payLoad };
      case `submitForm`:
        return initialState;
      default:
        throw new Error(`Unknown Action`);
    }
  };
  const [
    {
      date,
      cityName,
      country,
      notes,
      isLoadingGeoCoding,
      isErrorGeoCoding,
      flagImg,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const [lat, lng] = useGetParams();
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();

  useEffect(() => {
    if (!lat && !lng) return;
    async function fetchCityData() {
      try {
        dispatch({ type: `GeoCoding/start` });
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if (!data.countryCode) throw new Error(`please choose a valid City`);
        const countryCode = data.countryCode.toLowerCase();
        dispatch({
          type: `GeoCoding/finish`,
          payLoad: {
            cityName: data.city
              ? data.city
              : data.locality === `Israel and The Palestinian Territories`
              ? `Israel`
              : data.locality || "",
            country: data.countryCode === `PS` ? `Israel` : data.countryName,
            flagImg: `https://www.worldatlas.com/img/flag/${
              countryCode == `ps` ? `il` : countryCode
            }-flag.jpg`,
          },
        });
      } catch (err) {
        dispatch({ type: `rejected`, payLoad: err.message });
        console.error(err);
      }
    }
    fetchCityData();
  }, [lat, lng]);

  const handleSumbit = async (e) => {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      flagImg,
      date,
      notes,
      lat,
      lng,
    };
    await createCity(newCity);
    dispatch({ type: `submitForm` });
    navigate(`/app/cities`);
  };

  if (!lat && !lng)
    return <Message message={`Click On The Map To Add a City `} />;
  if (isLoadingGeoCoding) return <Spinner />;
  if (isErrorGeoCoding) return <Message message={isErrorGeoCoding} />;
  return (
    <form
      className={`${isLoading ? styles.loading : ``} ${styles.form}`}
      onSubmit={handleSumbit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) =>
            dispatch({ type: `setCityName`, payLoad: e.target.value })
          }
          value={cityName}
        />
        {flagImg.current && (
          <img className={styles.flagImg} src={flagImg.current} />
        )}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>

        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => dispatch({ type: `setDate`, payLoad: date })}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) =>
            dispatch({ type: `setNotes`, payLoad: e.target.value })
          }
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type={`primary`}>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
