const test = require("node:test");
const assert = require("node:assert/strict");
const {
  onlyDigits,
  formatCardNumber,
  formatExpiry,
  isValidCardNumber,
  isValidExpiry,
} = require("../src/front/js/component/cardValidation.common.cjs");

test("elimina caracteres ajenos a campos numéricos", () => {
  assert.equal(onlyDigits("12a-34 / 5"), "12345");
});

test("formatea la tarjeta en grupos de cuatro dígitos", () => {
  assert.equal(formatCardNumber("4242424242424242"), "4242 4242 4242 4242");
  assert.equal(formatCardNumber("4242 4242 extra"), "4242 4242");
});

test("formatea la caducidad como MM/AA", () => {
  assert.equal(formatExpiry("1230"), "12/30");
  assert.equal(formatExpiry("09"), "09");
});

test("valida el número con el algoritmo de Luhn", () => {
  assert.equal(isValidCardNumber("4242 4242 4242 4242"), true);
  assert.equal(isValidCardNumber("4242 4242 4242 4241"), false);
  assert.equal(isValidCardNumber("123"), false);
});

test("rechaza fechas vencidas y meses inexistentes", () => {
  assert.equal(isValidExpiry("13/30"), false);
  assert.equal(isValidExpiry("01/20"), false);
  assert.equal(isValidExpiry("12/99"), true);
});
