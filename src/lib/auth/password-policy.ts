export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 128;

export interface PasswordValidationState {
  minLength: boolean;
  maxLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  valid: boolean;
}

export interface PasswordRequirementItem {
  key: string;
  label: string;
  isMet: (state: PasswordValidationState) => boolean;
}

const UPPERCASE_PATTERN = /[A-Z]/;
const LOWERCASE_PATTERN = /[a-z]/;
const NUMBER_PATTERN = /[0-9]/;
const SPECIAL_PATTERN = /[^A-Za-z0-9]/;

export function validatePassword(password: string): PasswordValidationState {
  const minLength = password.length >= PASSWORD_MIN_LENGTH;
  const maxLength = password.length <= PASSWORD_MAX_LENGTH;
  const uppercase = UPPERCASE_PATTERN.test(password);
  const lowercase = LOWERCASE_PATTERN.test(password);
  const number = NUMBER_PATTERN.test(password);
  const special = SPECIAL_PATTERN.test(password);

  return {
    minLength,
    maxLength,
    uppercase,
    lowercase,
    number,
    special,
    valid:
      minLength &&
      maxLength &&
      uppercase &&
      lowercase &&
      number &&
      special,
  };
}

export function getPasswordPolicyErrorMessage(password: string): string | null {
  const state = validatePassword(password);

  if (state.valid) {
    return null;
  }

  if (!state.maxLength) {
    return `Password must be no more than ${PASSWORD_MAX_LENGTH} characters.`;
  }

  return "Password must be 10–128 characters and include uppercase, lowercase, a number, and a special character.";
}

export const PASSWORD_REQUIREMENT_ITEMS: PasswordRequirementItem[] = [
  {
    key: "length",
    label: "10–128 characters",
    isMet: (state) => state.minLength && state.maxLength,
  },
  {
    key: "uppercase",
    label: "One uppercase letter",
    isMet: (state) => state.uppercase,
  },
  {
    key: "lowercase",
    label: "One lowercase letter",
    isMet: (state) => state.lowercase,
  },
  {
    key: "number",
    label: "One number",
    isMet: (state) => state.number,
  },
  {
    key: "special",
    label: "One special character",
    isMet: (state) => state.special,
  },
];
