import React from "react";

import Context from "./Context";

const ProviderChild = ({
  loading,
  error,
  LoadingComponent,
  ErrorComponent,
  children,
}) => {
  if (error) {
    return ErrorComponent;
  }

  if (loading) {
    return LoadingComponent;
  }

  return children;
};

export default ({
  store,
  persistor = null,
  LoadingComponent = null,
  ErrorComponent = null,
  children,
}) => {
  // has persistor = loading

  const [loading, setLoading] = React.useState(persistor !== null);

  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (!loading) {
      return;
    }

    // init persistor, if any

    persistor
      .init()
      .catch((error) => {
        setError(true);

        throw error;
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Context.Provider value={{ store, persistor }}>
      <ProviderChild
        loading={loading}
        error={error}
        LoadingComponent={LoadingComponent}
        ErrorComponent={ErrorComponent}
      >
        {children}
      </ProviderChild>
    </Context.Provider>
  );
};
