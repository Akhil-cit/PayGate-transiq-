export function formatINR(amount) {
  const n = Math.round(Number(amount) || 0);
  return "₹" + n.toLocaleString("en-IN");
}

export function formatCompactINR(amount) {
  const n = Number(amount) || 0;
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + "Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(2) + "L";
  if (n >= 1000) return "₹" + (n / 1000).toFixed(1) + "K";
  return "₹" + n;
}
