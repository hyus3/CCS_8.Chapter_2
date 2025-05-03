// src/services/cacheHelper.ts
/**
 * Safely retrieve a value from a Map, ensuring the return type matches the expected value type.
 * @param cache The Map to retrieve from.
 * @param key The key to look up.
 * @param defaultValue The value to return if the key is not found.
 * @returns The cached value or the default value.
 */
export function safeGetCache<T>(cache: Map<string, T>, key: string, defaultValue: T): T {
  if (cache.has(key)) {
    const value = cache.get(key);
    return value !== undefined ? value : defaultValue;
  }
  return defaultValue;
}