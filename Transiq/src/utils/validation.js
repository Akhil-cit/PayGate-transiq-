/**
 * Central Validation utilities across all modules
 */

export function validatePocketName(name) {
  if (!name || !name.trim()) {
    return 'Pocket name is required.';
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return 'Pocket name must be at least 2 characters.';
  }
  if (trimmed.length > 60) {
    return 'Pocket name cannot exceed 60 characters.';
  }
  return null;
}

export function validatePocketTarget(target) {
  if (target === '' || target === null || target === undefined) {
    return null;
  }
  const num = Number(target);
  if (Number.isNaN(num)) {
    return 'Target amount must be a valid number.';
  }
  if (num < 0) {
    return 'Target amount cannot be negative.';
  }
  if (num > 100000000) {
    return 'Target amount cannot exceed 100,000,000.';
  }
  return null;
}

export function validateMoveAmount(amount, availableBalance, type = 'deposit', isLocked = false) {
  if (isLocked) {
    return 'Pocket is locked. Please unlock it to move funds.';
  }
  if (amount === '' || amount === null || amount === undefined) {
    return 'Please enter an amount.';
  }
  const num = Number(amount);
  if (Number.isNaN(num) || num <= 0) {
    return 'Amount must be greater than 0.';
  }
  if (type === 'deposit') {
    if (num > Number(availableBalance || 0)) {
      return `Amount exceeds available wallet balance (${Number(availableBalance || 0).toFixed(2)}).`;
    }
  } else if (type === 'withdraw') {
    if (num > Number(availableBalance || 0)) {
      return `Amount exceeds pocket balance (${Number(availableBalance || 0).toFixed(2)}).`;
    }
  }
  return null;
}

export function validateEmail(email) {
  if (!email || !email.trim()) {
    return 'Email address is required.';
  }
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return 'Please enter a valid email address.';
  }
  return null;
}

export function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return 'Phone number is required.';
  }
  let digits = phone.trim().replace(/\D/g, '');
  
  // Handle optional 91 or 0 prefix
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  if (digits.length !== 10) {
    return 'Phone number must be exactly 10 digits (excluding country code).';
  }
  if (!/^[6-9]/.test(digits)) {
    return 'Phone number should start with 6, 7, 8, or 9.';
  }
  return null;
}

export function validateName(name, fieldName = 'Name') {
  if (!name || !name.trim()) {
    return `${fieldName} is required.`;
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return `${fieldName} must be at least 2 characters.`;
  }
  if (trimmed.length > 50) {
    return `${fieldName} cannot exceed 50 characters.`;
  }
  return null;
}

export function validateAccountNumber(acc) {
  if (!acc || !acc.trim()) {
    return 'Bank account number is required.';
  }
  const trimmed = acc.trim();
  if (trimmed.length < 6 || trimmed.length > 20) {
    return 'Account number must be between 6 and 20 characters.';
  }
  if (!/^[a-zA-Z0-9]+$/.test(trimmed)) {
    return 'Account number can only contain letters and numbers.';
  }
  return null;
}

export function validateIfsc(ifsc) {
  if (!ifsc || !ifsc.trim()) {
    return 'IFSC code is required.';
  }
  const trimmed = ifsc.trim().toUpperCase();
  if (trimmed.length !== 11) {
    return 'IFSC code must be exactly 11 characters (e.g. HDFC0001234).';
  }
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(trimmed)) {
    return 'Invalid IFSC format. 5th character must be 0 (e.g. HDFC0001234).';
  }
  return null;
}

export function validatePin(pin) {
  if (!pin || !pin.trim()) {
    return 'Security PIN is required.';
  }
  const trimmed = pin.trim();
  if (!/^\d{4}$/.test(trimmed)) {
    return 'Security PIN must be exactly 4 numeric digits.';
  }
  return null;
}

export function validatePassword(password) {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  if (!hasLetter || !hasDigit) {
    return 'Password must contain at least one letter and one number.';
  }
  return null;
}

export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: 'None', color: '#9ca3af' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Weak', color: '#ef4444' };
  if (score <= 4) return { score, label: 'Medium', color: '#f59e0b' };
  return { score, label: 'Strong', color: '#10b981' };
}
