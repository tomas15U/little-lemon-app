const NAME_PATTERN = /^[A-Za-z\s]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length > 0 && NAME_PATTERN.test(trimmed);
}

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}
