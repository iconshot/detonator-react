import React from "react";

import Context from "./Context";

export default () => {
  const { persistor } = React.useContext(Context);

  return persistor;
};
