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

    return keys.every(
      (key) => key in currentValue && compare(value[key], currentValue[key])
    );
  }

  // for anything else, check equality

  return value === currentValue;
}

export default compare;
