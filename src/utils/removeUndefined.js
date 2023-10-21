function removeUndefined(obj) {
  const cleanedObj = {};

  try {
    if (typeof obj !== "object" || obj === null) return obj;

    if (Array.isArray(obj)) {
      return obj.map(removeUndefined).filter((item) => item !== undefined);
    }

    Object.entries(obj).forEach(([key, value]) => {
      const cleanedValue = removeUndefined(value);
      if (cleanedValue !== undefined) {
        cleanedObj[key] = cleanedValue;
      }
    });
  } catch (e) {
    return null;
  }
  return cleanedObj;
}

export default removeUndefined;