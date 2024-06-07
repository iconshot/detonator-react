import React from "react";

import Context from "./Context";

const ProviderChild = ({ loading, error, LoadingComponent, children }) => {
  if (error) {
    return null;
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

    setTimeout(() => {
      persistor
        .init()
        .catch((error) => {
          setError(true);

          throw error;
        })
        .finally(() => {
          setLoading(false);
        });
    }, 5000);
  }, []);

  return (
    <Context.Provider value={{ store, persistor }}>
      <ProviderChild
        loading={loading}
        error={error}
        LoadingComponent={LoadingComponent}
      >
        {children}
      </ProviderChild>
    </Context.Provider>
  );
};
