import {
  validateName,
  validateAccountNumber,
  validateIfsc,
  validatePhone,
  validateEmail,
  validatePin,
  validatePocketName,
  validatePocketTarget,
  validateMoveAmount,
  validatePassword,
  getPasswordStrength,
} from '../../Transiq/src/utils/validation.js';

describe('Unit Testing: Client & Server Input Validation (utils/validation.js)', () => {
  describe('validateName()', () => {
    test('rejects empty or whitespace-only name', () => {
      expect(validateName('', 'Name')).toMatch(/required/i);
      expect(validateName('   ', 'Name')).toMatch(/required/i);
    });

    test('rejects names shorter than 2 characters or longer than 50', () => {
      expect(validateName('A', 'Name')).toMatch(/at least 2 characters/i);
      expect(validateName('A'.repeat(51), 'Name')).toMatch(/cannot exceed 50/i);
    });

    test('accepts valid full names', () => {
      expect(validateName('Arjun Mehta', 'Name')).toBeNull();
      expect(validateName('P. Ramesh', 'Name')).toBeNull();
    });
  });

  describe('validateAccountNumber()', () => {
    test('rejects special characters', () => {
      expect(validateAccountNumber('50100@#$456')).toMatch(/letters and numbers/i);
    });

    test('rejects account numbers outside 6-20 character range', () => {
      expect(validateAccountNumber('12345')).toMatch(/between 6 and 20/i);
      expect(validateAccountNumber('123456789012345678901')).toMatch(/between 6 and 20/i);
    });

    test('accepts valid standard bank account numbers', () => {
      expect(validateAccountNumber('50100412345678')).toBeNull();
      expect(validateAccountNumber('123456789')).toBeNull();
    });
  });

  describe('validateIfsc()', () => {
    test('rejects malformed IFSC codes', () => {
      expect(validateIfsc('HDFC1234567')).toMatch(/Invalid IFSC/i);
      expect(validateIfsc('HDFCA000123')).toMatch(/Invalid IFSC/i);
      expect(validateIfsc('SBIN000')).toMatch(/must be exactly 11/i);
    });

    test('accepts valid 11-character IFSC codes', () => {
      expect(validateIfsc('HDFC0001234')).toBeNull();
      expect(validateIfsc('SBIN0004921')).toBeNull();
    });
  });

  describe('validatePhone()', () => {
    test('rejects invalid mobile numbers', () => {
      expect(validatePhone('1234567890')).toMatch(/start with 6, 7, 8, or 9/i);
      expect(validatePhone('987654321')).toMatch(/must be exactly 10 digits/i);
    });

    test('accepts valid Indian phone numbers', () => {
      expect(validatePhone('9876543210')).toBeNull();
      expect(validatePhone('7012345678')).toBeNull();
    });
  });

  describe('validateMoveAmount() & validatePocketTarget()', () => {
    test('rejects negative or zero move amounts', () => {
      expect(validateMoveAmount(-50, 5000)).toMatch(/greater than 0/i);
      expect(validateMoveAmount(0, 5000)).toMatch(/greater than 0/i);
    });

    test('enforces overdraft check against available balance', () => {
      expect(validateMoveAmount(6000, 5000, 'deposit')).toMatch(/exceeds available/i);
      expect(validateMoveAmount(2000, 5000, 'deposit')).toBeNull();
    });

    test('blocks move amount when pocket is locked', () => {
      expect(validateMoveAmount(500, 5000, 'withdraw', true)).toMatch(/Pocket is locked/i);
    });
  });

  describe('validatePin()', () => {
    test('rejects PINs that are not exactly 4 digits', () => {
      expect(validatePin('123')).toMatch(/exactly 4/i);
      expect(validatePin('12345')).toMatch(/exactly 4/i);
      expect(validatePin('12a4')).toMatch(/exactly 4/i);
    });

    test('accepts valid 4-digit PIN', () => {
      expect(validatePin('1234')).toBeNull();
      expect(validatePin('0000')).toBeNull();
    });
  });

  describe('validatePassword() & getPasswordStrength()', () => {
    test('rejects weak passwords shorter than 8 characters', () => {
      expect(validatePassword('Pass1')).toMatch(/at least 8 characters/i);
    });

    test('calculates correct strength scores', () => {
      expect(getPasswordStrength('Password@123').label).toBe('Strong');
      expect(getPasswordStrength('Pass1234').label).toBe('Medium');
    });
  });
});
