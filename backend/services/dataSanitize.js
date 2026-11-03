export const sanitizeData = (str) => {
  return str.trim().replace(/\s+/g, ' ');
};

const isPlainObject = (obj) => {
  if (Object.prototype.toString.call(obj) !== '[object Object]') return false;
  const prototype = Object.getPrototypeOf(obj);
  return prototype === null || prototype === Object.prototype;
};

export const cleanseData = (data) => {

  if (data === null) {
    return null;
  }

  if (data === null || data === undefined) {
    return undefined;
  }

  if (typeof data === 'string') {
    const sanitized = sanitizeData(data);
    return sanitized.length > 0 ? sanitized : null;
  }

  if (data instanceof Date || data instanceof RegExp) {
    return data;
  }

  if (Array.isArray(data)) {
    const cleanedArray = data
      .map((item) => cleanseData(item))
      .filter((item) => item !== undefined && item !== null);
    
    return cleanedArray.length > 0 ? cleanedArray : undefined;
  }

  if (isPlainObject(data)) {
    const cleanObj = {};
    for (const [key, value] of Object.entries(data)) {
      const cleanedValue = cleanseData(value);
      if (cleanedValue !== undefined) {
        cleanObj[key] = cleanedValue;
      }
    }
    return Object.keys(cleanObj).length > 0 ? cleanObj : undefined;
  }

  return data;
};