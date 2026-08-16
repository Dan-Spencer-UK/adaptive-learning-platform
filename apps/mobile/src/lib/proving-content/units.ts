/**
 * CC-05C: maps a governed answer `quantity` (@alp/content-schema's
 * AnswerContract.quantity, e.g. "voltage") to its SI unit symbol for
 * display next to the numeric input / feedback text. Covers exactly the
 * quantities this proving slice's blueprints use.
 */
const QUANTITY_UNIT_SYMBOLS: Readonly<Record<string, string>> = {
  voltage: "V",
  current: "A",
  resistance: "Ω",
};

export function unitSymbolForQuantity(quantity: string | undefined): string {
  if (!quantity) return "";
  return QUANTITY_UNIT_SYMBOLS[quantity] ?? quantity;
}
