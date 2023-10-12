import { useState } from "react";

const useGeoLocation = (defaultPos = null) => {
  const [location, setLocation] = useState(defaultPos);
  const [isLoading, setIsLoading] = useState(false);

  const getPosition = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude]);
        setIsLoading(false);
      },
      () => {
        console.log(`error`);
        setIsLoading(false);
      }
    );
  };
  return { location, isLoading, getPosition };
};
export { useGeoLocation };
