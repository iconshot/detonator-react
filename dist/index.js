import React from 'react';

var Context = /*#__PURE__*/React.createContext({
  store: null,
  persistor: null
});

var Provider = (({
  store,
  persistor = null,
  LoadingComponent = null,
  children
}) => {
  // persistor is null = loaded

  const [loaded, setLoaded] = React.useState(persistor === null);
  React.useEffect(() => {
    // init persistor, if any

    if (persistor !== null) {
      persistor.init().then(() => {
        setLoaded(true);
      });
    }
  }, []);
  return /*#__PURE__*/React.createElement(Context.Provider, {
    value: {
      store,
      persistor
    }
  }, !loaded ? LoadingComponent : children);
});

var useStore = (() => {
  const {
    store
  } = React.useContext(Context);
  return store;
});

var usePersistor = (() => {
  const {
    persistor
  } = React.useContext(Context);
  return persistor;
});

function compareDeep(value, currentValue) {
  // for null values, check if currentValue is also null

  if (value === null) {
    return currentValue === null;
  }

  // for arrays, compare items deeply

  if (Array.isArray(value)) {
    return Array.isArray(currentValue) && value.length === currentValue.length && value.every((item, i) => compareDeep(item, currentValue[i]));
  }

  // for objects, compare properties deeply

  if (typeof value === "object") {
    if (currentValue === null) {
      return false;
    }
    if (typeof currentValue !== "object") {
      return false;
    }
    const keys = Object.keys(value);
    const currentKeys = Object.keys(currentValue);
    return keys.length === currentKeys.length && keys.every(key => key in currentValue && compareDeep(value[key], currentValue[key]));
  }

  // for anything else, check equality

  return value === currentValue;
}
var useSelector = (closure => {
  const store = useStore();
  const state = store.getState();
  const result = closure(state); // closure is called here so we can handle props updates and store updates

  const [_, forceUpdate] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    store.on("update", onCompare);
    return () => {
      store.off("update", onCompare);
    };
  }); // trigger every time this component is rendered

  const onCompare = () => {
    try {
      const newResult = closure(state);
      const updated = !compareDeep(newResult, result);
      if (updated) {
        forceUpdate();
      }
    } catch (error) {}
  };
  return result;
});

export { Context, Provider, usePersistor, useSelector, useStore };
