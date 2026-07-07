const LIST_KEYS = ['content', 'items', 'results', 'list', 'pickups', 'data'] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const hasKnownListKey = (value: Record<string, unknown>) =>
  LIST_KEYS.some((key) => key in value);

export const normalizeList = <T>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (!isRecord(value)) {
    return [];
  }

  for (const key of LIST_KEYS) {
    const nested = value[key];

    if (Array.isArray(nested)) {
      return nested as T[];
    }

    if (isRecord(nested)) {
      const list = normalizeList<T>(nested);
      if (list.length > 0 || hasKnownListKey(nested)) {
        return list;
      }
    }
  }

  return [];
};
