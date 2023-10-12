import { createContext, useCallback, useContext, useReducer } from "react";
import { useEffect } from "react";
import supabase from "../supabase/supabase";
const CitiesContext = createContext();
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: false,
};
const CitiesProvider = ({ children }) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "loading":
        return { ...state, isLoading: true };
      case "rejected":
        return { ...state, isLoading: false, error: action.payLoad };
      case "cities/loaded":
        return {
          ...state,
          isLoading: false,
          cities: action.payLoad,
        };
      case "city/created":
        return {
          ...state,
          isLoading: false,
          cities: [...state.cities, action.payLoad],
          currentCity: action.payLoad,
        };
      case "city/deleted":
        return {
          ...state,
          isLoading: false,
          cities: state.cities.filter((city) => city.id !== action.payLoad),
          currentCity: {},
        };
      case "city/loaded":
        return { ...state, isLoading: false, currentCity: action.payLoad };
      default:
        throw new Error(`unknown action type`);
    }
  };
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(() => {
    const fetchCities = async () => {
      dispatch({ type: `loading` });
      let { data: cities, error } = await supabase.from("cities").select("*");
      if (error)
        dispatch({
          type: `rejected`,
          payLoad: `There Was And Error Loading The Cities`,
        });
      else dispatch({ type: `cities/loaded`, payLoad: cities });
    };
    fetchCities();
  }, []);

  const getCity = useCallback(
    async (id) => {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: `loading` });
      let { data: city, error } = await supabase
        .from("cities")
        .select("*")
        .eq("id", id);
      if (!error) dispatch({ type: `city/loaded`, payLoad: city });
      else
        dispatch({
          type: `rejected`,
          payLoad: `There Was An Error Loading The City`,
        });
    },
    [currentCity.id]
  );
  const createCity = async (newCity) => {
    dispatch({ type: `loading` });
    const { data, error } = await supabase
      .from("cities")
      .insert([newCity])
      .select()
      .single();
    if (!error) dispatch({ type: `city/created`, payLoad: data });
    else
      dispatch({
        type: `rejected`,
        payLoad: `There Was An Error Creating The City`,
      });
  };
  const deleteCity = async (id) => {
    dispatch({ type: `loading` });
    const { error } = await supabase.from("cities").delete().eq("id", id);
    if (!error) dispatch({ type: `city/deleted`, payLoad: id });
    else
      dispatch({
        type: `rejected`,
        payLoad: `There Was An Error Deleting The City`,
      });
  };

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

const useCities = () => {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error(`Cities Context used outside Context Provider`);
  return context;
};

export { CitiesProvider, useCities };
