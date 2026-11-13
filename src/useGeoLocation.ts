import { useState, useEffect } from "react";

// Source: https://raw.githubusercontent.com/codegeous/react-component-depot/refs/heads/master/src/hooks/useGeoLocation.js
const useGeoLocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
    // error: { code: "", message: "" }
  });

  const onSuccess = (location) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
    });
  };

  const onError = (error) => {
    setLocation({
      loaded: true,
      // @ts-expect-error (TODO: Fix types)
      error: {
        code: error.code,
        message: error.message,
      },
    });
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      // eslint-disable-next-line
      onError({
        code: 0,
        message: "Geolocation not supported",
      });
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return location;
};

export default useGeoLocation;