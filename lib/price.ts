/** Format integer cents as a euro string, dropping ",00" for whole amounts. */
export function formatEuro(cents: number): string {
  const euros = cents / 100;
  const hasCents = cents % 100 !== 0;
  const body = hasCents
    ? euros.toFixed(2).replace(".", ",")
    : String(Math.round(euros));
  return `${body} €`;
}

/** "ab 34 €" — for list/card prices that start from the cheapest variant. */
export function formatFrom(cents: number): string {
  return `ab ${formatEuro(cents)}`;
}
