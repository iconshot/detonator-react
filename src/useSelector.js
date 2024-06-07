import React from "react";

import useStore from "./useStore";

import compare from "./compare";

function select(closure, state) {
  return closure(state);
}

export default (closure) => {
  const store = useStore();

  const state = store.getState();

  const result = select(closure, state);

  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

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
};
