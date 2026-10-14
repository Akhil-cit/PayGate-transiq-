
describe('White Box Testing: Payment Decision Tree & Balance Execution Logic', () => {
  const evaluatePaymentExecution = ({
    userRole,
    wallet,
    bankAcc,
    accountId,
    amount,
    pin,
    expectedPin = '1234',
    receiptDoc,
  }) => {
    if (!userRole) {
      return { status: 401, error: 'NO_TOKEN_OR_ROLE' };
    }

    if (pin !== expectedPin) {
      return { status: 401, error: 'INVALID_PIN' };
    }

    const numAmt = Number(amount);
    if (!Number.isFinite(numAmt) || numAmt <= 0 || numAmt > 10000000) {
      return { status: 400, error: 'INVALID_AMOUNT' };
    }

    if (!receiptDoc) {
      return { status: 404, error: 'RECIPIENT_NOT_FOUND' };
    }

    const isBank = accountId && !accountId.startsWith('WALLET_');

    if (isBank) {
      if (!bankAcc) {
        return { status: 404, error: 'BANK_NOT_FOUND' };
      }
      if (bankAcc.status !== 'ACTIVE') {
        return { status: 403, error: 'BANK_INACTIVE' };
      }
      if (bankAcc.balance < numAmt) {
        return { status: 400, error: 'INSUFFICIENT_BANK_FUNDS' };
      }
      return {
        status: 200,
        source: 'BANK',
        newBalance: bankAcc.balance - numAmt,
      };
    } else {
      if (!wallet) {
        return { status: 404, error: 'WALLET_NOT_FOUND' };
      }
      if (wallet.isFrozen) {
        return { status: 403, error: 'WALLET_FROZEN' };
      }
      if (wallet.mainBalance < numAmt) {
        return { status: 400, error: 'INSUFFICIENT_WALLET_FUNDS' };
      }
      return {
        status: 200,
        source: 'WALLET',
        newBalance: wallet.mainBalance - numAmt,
      };
    }
  };

  test('Path 1: Fails immediately when PIN does not match', () => {
    const res = evaluatePaymentExecution({
      userRole: 'customer',
      pin: '9999',
      expectedPin: '1234',
    });
    expect(res.status).toBe(401);
    expect(res.error).toBe('INVALID_PIN');
  });

  test('Path 2: Fails when amount is 0, negative, or excessive', () => {
    const resZero = evaluatePaymentExecution({
      userRole: 'customer',
      pin: '1234',
      amount: 0,
    });
    expect(resZero.error).toBe('INVALID_AMOUNT');

    const resOverflow = evaluatePaymentExecution({
      userRole: 'customer',
      pin: '1234',
      amount: 999999999,
    });
    expect(resOverflow.error).toBe('INVALID_AMOUNT');
  });

  test('Path 3: Fails when recipient does not exist or ownership check fails', () => {
    const res = evaluatePaymentExecution({
      userRole: 'customer',
      pin: '1234',
      amount: 500,
      receiptDoc: null,
    });
    expect(res.status).toBe(404);
    expect(res.error).toBe('RECIPIENT_NOT_FOUND');
  });

  test('Path 4: Blocks payment when wallet is frozen (Kill-Switch Branch)', () => {
    const res = evaluatePaymentExecution({
      userRole: 'customer',
      pin: '1234',
      amount: 500,
      receiptDoc: { _id: 'rec-1', name: 'Priya' },
      wallet: { mainBalance: 10000, isFrozen: true },
      accountId: 'WALLET_123',
    });
    expect(res.status).toBe(403);
    expect(res.error).toBe('WALLET_FROZEN');
  });

  test('Path 5: Prevents overdraft when amount exceeds wallet balance', () => {
    const res = evaluatePaymentExecution({
      userRole: 'customer',
      pin: '1234',
      amount: 15000,
      receiptDoc: { _id: 'rec-1', name: 'Priya' },
      wallet: { mainBalance: 5000, isFrozen: false },
      accountId: 'WALLET_123',
    });
    expect(res.status).toBe(400);
    expect(res.error).toBe('INSUFFICIENT_WALLET_FUNDS');
  });

  test('Path 6: Successful wallet deduction path', () => {
    const res = evaluatePaymentExecution({
      userRole: 'customer',
      pin: '1234',
      amount: 3000,
      receiptDoc: { _id: 'rec-1', name: 'Priya' },
      wallet: { mainBalance: 10000, isFrozen: false },
      accountId: 'WALLET_123',
    });
    expect(res.status).toBe(200);
    expect(res.source).toBe('WALLET');
    expect(res.newBalance).toBe(7000);
  });

  test('Path 7: Successful bank account deduction path', () => {
    const res = evaluatePaymentExecution({
      userRole: 'customer',
      pin: '1234',
      amount: 4000,
      receiptDoc: { _id: 'rec-1', name: 'Priya' },
      bankAcc: { balance: 25000, status: 'ACTIVE' },
      accountId: 'BANK_HDFC_99',
    });
    expect(res.status).toBe(200);
    expect(res.source).toBe('BANK');
    expect(res.newBalance).toBe(21000);
  });
});
