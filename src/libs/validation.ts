/**
 * Validate email
 * @param email - Email value
 */
export function validateEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Validate min value length
 * @param value - Text
 * @param minLength - Min length
 */
export function minLength(value: string, minLength: number): boolean {
  return value.length >= minLength;
}
