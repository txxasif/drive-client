const toSnakeCase = (obj: Record<string, unknown>): Record<string, unknown> => {
  const snakeCaseObj: Record<string, unknown> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeCaseKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
      );
      snakeCaseObj[snakeCaseKey] = obj[key];
    }
  }

  return snakeCaseObj;
};

export { toSnakeCase };
