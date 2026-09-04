/**
 * CC-24 PA-review correction §3.A: [Corrected] an earlier version of this
 * module contained a hand-rolled JSON grammar parser and claimed it
 * performed "strict JSON" parsing. It did not: its number-literal
 * handling was lenient in ways the JSON grammar is not (it silently
 * accepted a leading-zero integer like `01`, a bare trailing decimal
 * point like `1.`, and an exponent with no digits like `1e`, none of
 * which are valid JSON). Claiming grammar strictness that was not
 * actually implemented is itself the kind of false-green defect this
 * correction pass exists to close.
 *
 * The corrected design does NOT re-implement JSON grammar at all:
 *   1. `JSON.parse` -- the real, spec-compliant, engine-native parser --
 *      is the SOLE authority on whether `text` is valid JSON. Any
 *      grammar violation (a malformed number, unterminated string,
 *      trailing content, a JS-style comment, etc.) is caught here as a
 *      `JSON.parse` failure, never re-validated by bespoke code.
 *   2. ONLY once `JSON.parse` has succeeded does a separate, lightweight
 *      SCANNER walk the same raw text to detect a duplicate key within
 *      one object literal -- something `JSON.parse` itself silently
 *      allows (keeping only the last occurrence). This scanner does not
 *      need to re-validate number/string grammar (already proven valid
 *      by step 1); it only needs to correctly track object/array nesting
 *      and skip over string content (respecting escapes) so bracket
 *      characters inside a string never confuse its depth tracking.
 */

export class DuplicateJsonKeyError extends Error {
  readonly key: string;
  readonly path: string;
  readonly position: number;

  constructor(key: string, path: string, position: number) {
    super(`DuplicateJsonKeyError: key "${key}" occurs more than once in the object at "${path}" (position ${position}).`);
    this.name = "DuplicateJsonKeyError";
    this.key = key;
    this.path = path;
    this.position = position;
  }
}

export class StrictJsonSyntaxError extends Error {
  readonly position: number;
  constructor(message: string, position: number) {
    super(`StrictJsonSyntaxError: ${message} (position ${position}).`);
    this.name = "StrictJsonSyntaxError";
    this.position = position;
  }
}

const WHITESPACE = new Set([" ", "\t", "\n", "\r"]);
const DELIMITERS = new Set([",", "}", "]", " ", "\t", "\n", "\r"]);

/**
 * Walks already-`JSON.parse`-validated `text` and throws
 * `DuplicateJsonKeyError` the moment a second occurrence of a key is
 * seen within the same object literal. Never re-validates number/string
 * grammar -- the caller (`parseStrictJson`) guarantees `text` is valid
 * JSON before this runs.
 */
function assertNoDuplicateKeys(text: string): void {
  let pos = 0;
  const len = text.length;

  function skipWhitespace(): void {
    while (pos < len && WHITESPACE.has(text[pos]!)) pos++;
  }

  /** Reads a JSON string starting at `text[pos] === '"'`, returning its decoded value and advancing `pos` past the closing quote. Grammar is already proven valid by `JSON.parse`, so this does not itself throw on malformed escapes. */
  function readString(): string {
    pos++; // opening quote
    let out = "";
    for (;;) {
      const c = text[pos]!;
      if (c === '"') {
        pos++;
        return out;
      }
      if (c === "\\") {
        const esc = text[pos + 1];
        if (esc === "u") {
          out += String.fromCharCode(parseInt(text.slice(pos + 2, pos + 6), 16));
          pos += 6;
        } else {
          const unescaped: Record<string, string> = { '"': '"', "\\": "\\", "/": "/", b: "\b", f: "\f", n: "\n", r: "\r", t: "\t" };
          out += unescaped[esc!] ?? esc!;
          pos += 2;
        }
        continue;
      }
      out += c;
      pos++;
    }
  }

  function skipValue(path: string): void {
    skipWhitespace();
    const c = text[pos];
    if (c === "{") {
      walkObject(path);
      return;
    }
    if (c === "[") {
      walkArray(path);
      return;
    }
    if (c === '"') {
      readString();
      return;
    }
    // number / true / false / null -- span up to the next structural delimiter.
    while (pos < len && !DELIMITERS.has(text[pos]!)) pos++;
  }

  function walkArray(path: string): void {
    pos++; // '['
    skipWhitespace();
    if (text[pos] === "]") {
      pos++;
      return;
    }
    let index = 0;
    for (;;) {
      skipValue(`${path}[${index}]`);
      index++;
      skipWhitespace();
      if (text[pos] === ",") {
        pos++;
        skipWhitespace();
        continue;
      }
      pos++; // ']'
      return;
    }
  }

  function walkObject(path: string): void {
    pos++; // '{'
    const seenKeys = new Set<string>();
    skipWhitespace();
    if (text[pos] === "}") {
      pos++;
      return;
    }
    for (;;) {
      skipWhitespace();
      const keyStart = pos;
      const key = readString();
      if (seenKeys.has(key)) throw new DuplicateJsonKeyError(key, path, keyStart);
      seenKeys.add(key);
      skipWhitespace();
      pos++; // ':'
      skipValue(`${path}.${key}`);
      skipWhitespace();
      if (text[pos] === ",") {
        pos++;
        skipWhitespace();
        continue;
      }
      pos++; // '}'
      return;
    }
  }

  skipWhitespace();
  skipValue("$");
}

function positionFromNativeErrorMessage(message: string): number {
  const match = /position (\d+)/.exec(message);
  return match ? Number(match[1]) : 0;
}

/**
 * The sole entry point: `JSON.parse` is the authority on grammar
 * validity (a malformed number such as `01`, `1.`, `1e`, or `-01`,
 * trailing content, or a comment all fail here, exactly as they would
 * fail native `JSON.parse` -- because this IS native `JSON.parse`).
 * Only once that succeeds does the duplicate-key scanner run over the
 * same raw text. Returns the value `JSON.parse` produced (duplicate
 * keys collapsed, as `JSON.parse` always does) -- the CALLER learns
 * about a duplicate only via the thrown `DuplicateJsonKeyError`, never
 * from the returned value itself.
 */
export function parseStrictJson(text: string): unknown {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new StrictJsonSyntaxError(message, positionFromNativeErrorMessage(message));
  }
  assertNoDuplicateKeys(text);
  return value;
}
