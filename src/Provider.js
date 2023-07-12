import React from "react";

import Context from "./Context";

export default ({
  store,
  persistor = null,
  LoadingComponent = null,
  children,
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

  return (
    <Context.Provider value={{ store, persistor }}>
      {!loaded ? LoadingComponent : children}
    </Context.Provider>
  );
};
