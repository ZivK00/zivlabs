export const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

export const unique = (values) => [...new Set(values)];

export const isoNow = (clock = () => new Date()) => clock().toISOString();

export const clone = (value) => JSON.parse(JSON.stringify(value));
