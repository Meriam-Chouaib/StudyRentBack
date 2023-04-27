export function testValue<T>(value: T, key: string): any {
  let obj: any = {};
  switch (true) {
    case value === '':
      return true;
    case typeof value === 'string' && value != null:
      obj = {};
      obj[key] = { contains: value };
      return obj;
    case typeof value === 'number':
      obj = {};
      obj[key] = { equals: Number(value) };
      return obj;
    case Array.isArray(value) && value.every((item) => typeof item === 'number'):
      obj = {};

      obj[key] = { lte: value[1], gte: value[0] };
      return obj;
    default:
      return true;
  }
}

export function applyFilters<T extends Record<string, any>>(obj: T): any {
  let filters: {} = {};
  for (const [key, value] of Object.entries(obj)) {
    filters = Object.assign(filters, { ...testValue(value, key) });
  }
  return filters;
}
