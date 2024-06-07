import React from 'react';

var Context = /*#__PURE__*/React.createContext({
  store: null,
  persistor: null
});

const ProviderChild = ({
  loading,
  error,
  LoadingComponent,
  ErrorComponent,
  children
}) => {
  if (error) {
    return ErrorComponent;
  }
  if (loading) {
    return LoadingComponent;
  }
  return children;
};
var Provider = (({
  store,
  persistor = null,
  LoadingComponent = null,
  ErrorComponent = null,
  children
}) => {
  // has persistor = loading

  const [loading, setLoading] = React.useState(persistor !== null);
  const [error, setError] = React.useState(false);
  React.useEffect(() => {
    if (!loading) {
      return;
    }

    // init persistor, if any

    persistor.init().catch(error => {
      setError(true);
      throw error;
    }).finally(() => {
      setLoading(false);
    });
  }, []);
  return /*#__PURE__*/React.createElement(Context.Provider, {
    value: {
      store,
      persistor
    }
  }, /*#__PURE__*/React.createElement(ProviderChild, {
    loading: loading,
    error: error,
    LoadingComponent: LoadingComponent,
    ErrorComponent: ErrorComponent
  }, children));
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

function compare(value, currentValue) {
  // for null values, check if currentValue is also null

  if (value === null) {
    return currentValue === null;
  }

  // for arrays, compare items deeply

  if (Array.isArray(value)) {
    if (!Array.isArray(currentValue)) {
      return false;
    }
    if (value.length !== currentValue.length) {
      return false;
    }
    return value.every((item, i) => compare(item, currentValue[i]));
  }

  // for objects, compare properties deeply

  if (typeof value === "object") {
    if (currentValue === null) {
      return false;
    }
    if (Array.isArray(currentValue)) {
      return false;
    }
    if (typeof currentValue !== "object") {
      return false;
    }
    const keys = Object.getOwnPropertyNames(value);
    const currentKeys = Object.getOwnPropertyNames(currentValue);
    if (keys.length !== currentKeys.length) {
      return false;
    }
    return keys.every(key => key in currentValue && compare(value[key], currentValue[key]));
  }

  // for anything else, check equality

  return value === currentValue;
}

function select(closure, state) {
  return closure(state);
}
var useSelector = (closure => {
  const store = useStore();
  const state = store.getState();
  const result = select(closure, state);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  // trigger effect every time component is rendered

  React.useEffect(() => {
    store.on("update", onCompare);
    return () => {
      store.off("update", onCompare);
    };
  });
  const onCompare = () => {
    const tmpResult = select(closure, state);
    const equal = compare(tmpResult, result);
    if (equal) {
      return;
    }
    forceUpdate();
  };
  return result;
});

export { Context, Provider, usePersistor, useSelector, useStore };
