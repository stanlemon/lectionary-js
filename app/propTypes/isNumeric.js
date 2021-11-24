export function isNumeric(props, propName, componentName) {
  if (!checkNumeric(props[propName])) {
    return new Error(
      `Invalid prop ${propName} passed to ${componentName}. Must be a numeric value.`
    );
  }
}

export function isRequiredNumeric(props, propName, componentName) {
  if (!props[propName]) {
    return new Error(
      `Prop ${propName} passed to ${componentName} is required.`
    );
  }

  isNumeric(props, propName, componentName);
}

function checkNumeric(value) {
  return (
    (typeof value === "number" || typeof value === "string") &&
    !isNaN(Number(value))
  );
}
