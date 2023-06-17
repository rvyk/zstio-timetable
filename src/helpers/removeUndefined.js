function removeUndefined(obj) {
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(removeUndefined).filter((item) => item !== undefined);
  }

  const cleanedObj = {};
  Object.entries(obj).forEach(([key, value]) => {
    const cleanedValue = removeUndefined(value);
    if (cleanedValue !== undefined) {
      cleanedObj[key] = cleanedValue;
    }
  });
  return cleanedObj;
}

export default removeUndefined;
