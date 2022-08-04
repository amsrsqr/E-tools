import React, { useState, useContext } from "react";

const StoreContext = React.createContext();

export const useStore = () => {
  const {
    title,
    setTitle,
    country,
    setCountry,
    state,
    setState,
    suburb,
    setSuburb,
    facility,
    setFacility,
    priceFormat,
    setPriceFormat,
    payment,
    setPayment,
    category,
    setCategory,
    careType,
    setCareType,
    recovery,
    setRecovery,
  } = useContext(StoreContext);
  //const { store, setStore } = useContext(StoreContext);

  function setDataRecovery(key, data) {
    setRecovery({ ...recovery, [key]: data });
  }

  function getDataRecovery(key) {
    return recovery[key];
  }

  function removeDataRecovery(key) {
    const cloneStore = { ...recovery };
    delete cloneStore[key];
    setRecovery(cloneStore);
  }

  function setDataPriceFormat(key, data) {
    setPriceFormat({ ...priceFormat, [key]: data });
  }

  function getDataPriceFormat(key) {
    return priceFormat[key];
  }

  function removeDataPriceFormat(key) {
    const cloneStore = { ...priceFormat };
    delete cloneStore[key];
    setPriceFormat(cloneStore);
  }

  function setDataPayment(key, data) {
    setPayment({ ...payment, [key]: data });
  }

  function getDataPayment(key) {
    return payment[key];
  }

  function removeDataPayment(key) {
    const cloneStore = { ...payment };
    delete cloneStore[key];
    setPayment(cloneStore);
  }

  function setDataCategory(key, data) {
    setCategory({ ...category, [key]: data });
  }

  function getDataCategory(key) {
    return category[key];
  }

  function removeDataCategory(key) {
    const cloneStore = { ...category };
    delete cloneStore[key];
    setCategory(cloneStore);
  }

  function setDataTitle(key, data) {
    setTitle({ ...title, [key]: data });
  }

  function getDataTitle(key) {
    return title[key];
  }

  function removeDataTitle(key) {
    const cloneStore = { ...title };
    delete cloneStore[key];
    setTitle(cloneStore);
  }

  function setDataCountry(key, data) {
    setCountry({ ...country, [key]: data });
  }

  function getDataCountry(key) {
    return country[key];
  }

  function removeDataCountry(key) {
    const cloneStore = { ...country };
    delete cloneStore[key];
    setCountry(cloneStore);
  }

  function setDataState(key, data) {
    setState({ ...state, [key]: data });
  }

  function getDataState(key) {
    return state[key];
  }

  function removeDataState(key) {
    const cloneStore = { ...state };
    delete cloneStore[key];
    setState(cloneStore);
  }

  function setDataSuburb(key, data) {
    setSuburb({ ...suburb, [key]: data });
  }

  function getDataSuburb(key) {
    return suburb[key];
  }

  function removeDataSuburb(key) {
    const cloneStore = { ...suburb };
    delete cloneStore[key];
    setSuburb(cloneStore);
  }

  function setDataFacility(key, data) {
    setFacility({ ...facility, [key]: data });
  }

  function getDataFacility(key) {
    return facility[key];
  }

  function removeDataFacility(key) {
    const cloneStore = { ...facility };
    delete cloneStore[key];
    setFacility(cloneStore);
  }

  function setDataCareType(key, data) {
    setCareType({ ...careType, [key]: data });
  }

  function getDataCareType(key) {
    return careType[key];
  }

  function removeDataCareType(key) {
    const cloneStore = { ...careType };
    delete cloneStore[key];
    setCareType(cloneStore);
  }

  return {
    setDataRecovery,
    getDataRecovery,
    removeDataRecovery,
    setDataTitle,
    getDataTitle,
    removeDataTitle,
    setDataCountry,
    getDataCountry,
    removeDataCountry,
    setDataState,
    getDataState,
    removeDataState,
    setDataSuburb,
    getDataSuburb,
    removeDataSuburb,
    setDataFacility,
    getDataFacility,
    removeDataFacility,
    setDataPriceFormat,
    getDataPriceFormat,
    removeDataPriceFormat,
    setDataPayment,
    getDataPayment,
    removeDataPayment,
    setDataCategory,
    getDataCategory,
    removeDataCategory,
    setDataCareType,
    getDataCareType,
    removeDataCareType,
    title,
    country,
    state,
    suburb,
    facility,
    priceFormat,
    payment,
    category,
    careType,
    recovery,
  };
};

export default function StoreProvider({ children }) {
  const [title, setTitle] = useState({});
  const [country, setCountry] = useState({});
  const [state, setState] = useState({});
  const [suburb, setSuburb] = useState({});
  const [facility, setFacility] = useState({});
  const [priceFormat, setPriceFormat] = useState({});
  const [payment, setPayment] = useState({});
  const [category, setCategory] = useState({});
  const [careType, setCareType] = useState({});

  return (
    <StoreContext.Provider
      value={{
        title,
        setTitle,
        country,
        setCountry,
        state,
        setState,
        suburb,
        setSuburb,
        facility,
        setFacility,
        priceFormat,
        setPriceFormat,
        payment,
        setPayment,
        category,
        setCategory,
        careType,
        setCareType,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
