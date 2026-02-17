import axios from 'axios';

const BASE_URL = 'https://api.countrystatecity.in/v1';
const API_KEY = import.meta.env.VITE_CSC_API_KEY; // User must provide this

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-CSCAPI-KEY': API_KEY,
  },
});

const cache = {
  countries: null,
  states: {},
  cities: {},
};

export const fetchCountries = async () => {
  if (cache.countries) return cache.countries;

  try {
    const { data } = await apiClient.get('/countries');
    cache.countries = data;
    return data;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

export const fetchStates = async (countryIso) => {
  if (!countryIso) return [];
  if (cache.states[countryIso]) return cache.states[countryIso];

  try {
    const { data } = await apiClient.get(`/countries/${countryIso}/states`);
    cache.states[countryIso] = data;
    return data;
  } catch (error) {
    console.error(`Error fetching states for ${countryIso}:`, error);
    throw error;
  }
};

export const fetchCities = async (countryIso, stateIso) => {
  if (!countryIso || !stateIso) return [];
  const cacheKey = `${countryIso}-${stateIso}`;
  if (cache.cities[cacheKey]) return cache.cities[cacheKey];

  try {
    const { data } = await apiClient.get(`/countries/${countryIso}/states/${stateIso}/cities`);
    cache.cities[cacheKey] = data;
    return data;
  } catch (error) {
    console.error(`Error fetching cities for ${countryIso}/${stateIso}:`, error);
    throw error;
  }
};
