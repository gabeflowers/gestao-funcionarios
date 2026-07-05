export function isValidCpf(cpf) {
  const digits = String(cpf).replace(/\D/g, '');

  if (digits.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(digits)) return false;

  const calcCheckDigit = (base) => {
    let sum = 0;
    const length = base.length;
    for (let i = 0; i < length; i++) {
      sum += Number(base[i]) * (length + 1 - i);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstNine = digits.slice(0, 9);
  const firstCheck = calcCheckDigit(firstNine);

  const firstTen = digits.slice(0, 10);
  const secondCheck = calcCheckDigit(firstTen);

  return (
    firstCheck === Number(digits[9]) &&
    secondCheck === Number(digits[10])
  );
}