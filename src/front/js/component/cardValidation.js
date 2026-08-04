export const onlyDigits = value => value.replace(/\D/g, "");

export const formatCardNumber = value => onlyDigits(value)
  .slice(0, 16)
  .replace(/(.{4})/g, "$1 ")
  .trim();

export const formatExpiry = value => {
  const digits = onlyDigits(value).slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export const isValidCardNumber = value => {
  const digits = onlyDigits(value);
  if (digits.length !== 16) return false;
  let sum = 0;
  let doubleDigit = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return sum % 10 === 0;
};

export const isValidExpiry = value => {
  const [monthText, yearText] = value.split("/");
  if (!/^\d{2}$/.test(monthText || "") || !/^\d{2}$/.test(yearText || "")) return false;
  const month = Number(monthText);
  const year = 2000 + Number(yearText);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
};
