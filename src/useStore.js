import React from "react";

import Context from "./Context";

export default () => {
  const { store } = React.useContext(Context);

  return store;
};
