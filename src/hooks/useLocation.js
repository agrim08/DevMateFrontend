import { useState, useEffect } from 'react';
import { fetchCountries, fetchStates, fetchCities } from '../services/locationService';

export const useLocation = (initialCountry = '', initialState = '', initialCity = '') => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedCity, setSelectedCity] = useState(initialCity);

  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState(null);

  // Sync with initial values when they change (e.g. data loaded from API)
  useEffect(() => {
    if (initialCountry) setSelectedCountry(initialCountry);
  }, [initialCountry]);

  useEffect(() => {
    if (initialState) setSelectedState(initialState);
  }, [initialState]);

  useEffect(() => {
     if (initialCity) setSelectedCity(initialCity);
  }, [initialCity]);

  // Load countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      setLoadingCountries(true);
      try {
        const data = await fetchCountries(); // Returns [{ id, name, iso2 }, ...]
        setCountries(data); 
      } catch (err) {
        setError('Failed to load countries');
      } finally {
        setLoadingCountries(false);
      }
    };
    loadCountries();
  }, []);

  // Fetch states when selectedCountry changes or countries load
  useEffect(() => {
    const loadStates = async () => {
      if (!selectedCountry) {
          setStates([]);
          return;
      }
      
      // If we don't have countries loaded yet, we can't find the ISO code
      if (countries.length === 0) return;

      const countryObj = countries.find(c => c.name === selectedCountry);
      if (!countryObj) return;

      setLoadingStates(true);
      try {
        const data = await fetchStates(countryObj.iso2);
        setStates(data);
      } catch (err) {
        setError('Failed to load states');
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };
    
    loadStates();
  }, [selectedCountry, countries]);

  // Fetch cities when selectedState changes or states load
  useEffect(() => {
      const loadCities = async () => {
          if (!selectedState || !selectedCountry) {
              setCities([]);
              return;
          }
          
          if (states.length === 0 || countries.length === 0) return;

          const countryObj = countries.find(c => c.name === selectedCountry);
          const stateObj = states.find(s => s.name === selectedState);
          
          if (!countryObj || !stateObj) return;

          setLoadingCities(true);
          try {
              const data = await fetchCities(countryObj.iso2, stateObj.iso2);
              setCities(data);
          } catch (err) {
              setError('Failed to load cities');
              setCities([]);
          } finally {
              setLoadingCities(false);
          }
      };

      loadCities();
  }, [selectedState, states, selectedCountry, countries]);



  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setSelectedState('');
    setSelectedCity('');
    setStates([]);
    setCities([]);
  };

  const handleStateChange = (value) => {
    setSelectedState(value);
    setSelectedCity('');
    setCities([]);
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
  };

  return {
    countries,
    states,
    cities,
    selectedCountry,
    selectedState,
    selectedCity,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
    loadingCountries,
    loadingStates,
    loadingCities,
    error
  };
};
