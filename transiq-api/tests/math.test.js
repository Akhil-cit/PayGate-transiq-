// White box unit testing example for core utilities

// Example utility function (in a real app, import from utils)
const calculateTransactionFee = (amount) => {
  if (amount <= 0) throw new Error('Invalid amount');
  if (amount < 1000) return 0;
  return amount * 0.01; // 1% fee for > 1000
};

describe('White Box Unit Testing: calculateTransactionFee', () => {
  test('Branch 1: Throws error for negative or zero amount', () => {
    expect(() => calculateTransactionFee(0)).toThrow('Invalid amount');
    expect(() => calculateTransactionFee(-500)).toThrow('Invalid amount');
  });

  test('Branch 2: Returns 0 fee for amounts under 1000', () => {
    expect(calculateTransactionFee(500)).toBe(0);
    expect(calculateTransactionFee(999)).toBe(0);
  });

  test('Branch 3: Returns 1% fee for amounts 1000 and above', () => {
    expect(calculateTransactionFee(1000)).toBe(10);
    expect(calculateTransactionFee(5000)).toBe(50);
  });
});
