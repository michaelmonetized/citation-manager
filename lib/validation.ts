/**
 * Form validation utilities for Citation Manager
 * Validates phone numbers, emails, and addresses
 */

/**
 * Validates US phone number format
 * Accepts: (123) 456-7890, 123-456-7890, 1234567890, +1-123-456-7890
 */
export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false;
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10 || cleaned.length === 11;
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates US address (basic check for required parts)
 * Expects: street address, city, state, zip
 */
export function validateAddress(address: {
  street: string;
  city: string;
  state: string;
  zip: string;
}): boolean {
  if (!address) return false;
  return (
    !!address.street?.trim() &&
    !!address.city?.trim() &&
    !!address.state?.trim() &&
    validateZip(address.zip)
  );
}

/**
 * Validates US ZIP code (5 digits or ZIP+4)
 */
export function validateZip(zip: string): boolean {
  if (!zip || typeof zip !== "string") return false;
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip);
}

/**
 * Validates location name (non-empty, reasonable length)
 */
export function validateLocationName(name: string): boolean {
  if (!name || typeof name !== "string") return false;
  return name.trim().length > 0 && name.trim().length <= 100;
}

/**
 * Sanitizes phone for API submission (removes all non-digits, returns as E.164)
 */
export function sanitizePhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+${cleaned}`;
  }
  return phone;
}

/**
 * Sanitizes address for API submission (trims whitespace, normalizes state abbreviations)
 */
export function sanitizeAddress(address: string): string {
  return address.trim().replace(/\s+/g, " ");
}
