/**
 * CC-24 PA-review correction §3: a minimal, dependency-free JSON parser
 * that behaves like `JSON.parse` except it REJECTS a duplicate key within
 * the same object literal. `JSON.parse` silently keeps only the LAST
 * occurrence of a repeated key -- a genuine defect (an accidentally
 * duplicated `unresolvedDimensions` key, for instance) survives parsing
 * undetected and would never be caught by any check written against the
 * already-parsed (and therefore already-collapsed) object. This parser
 * throws `DuplicateJsonKeyError` naming the exact key and its path the
 * moment a second occurrence is seen, so the pilot validator can inspect
 * the RAW text's actual structure, not a lossy in-memory approximation.
 *
 * Deliberately narrow: full JSON grammar (objects, arrays, strings with
 * standard escapes, numbers, true/false/null), no comments, no trailing
 * commas, no bespoke extensions -- a strict superset check on top of
 * ordinary JSON, not a different format.
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

class Parser {
  private readonly text: string;
  private pos = 0;

  constructor(text: string) {
    this.text = text;
  }

  parse(): unknown {
    this.skipWhitespace();
    const value = this.parseValue("$");
    this.skipWhitespace();
    if (this.pos !== this.text.length) throw new StrictJsonSyntaxError(`unexpected trailing content "${this.text.slice(this.pos, this.pos + 20)}"`, this.pos);
    return value;
  }

  private skipWhitespace(): void {
    while (this.pos < this.text.length && WHITESPACE.has(this.text[this.pos]!)) this.pos++;
  }

  private peek(): string {
    if (this.pos >= this.text.length) throw new StrictJsonSyntaxError("unexpected end of input", this.pos);
    return this.text[this.pos]!;
  }

  private expect(char: string): void {
    if (this.peek() !== char) throw new StrictJsonSyntaxError(`expected "${char}" but found "${this.peek()}"`, this.pos);
    this.pos++;
  }

  private parseValue(path: string): unknown {
    this.skipWhitespace();
    const c = this.peek();
    if (c === "{") return this.parseObject(path);
    if (c === "[") return this.parseArray(path);
    if (c === '"') return this.parseString();
    if (c === "t") return this.parseLiteral("true", true);
    if (c === "f") return this.parseLiteral("false", false);
    if (c === "n") return this.parseLiteral("null", null);
    if (c === "-" || (c >= "0" && c <= "9")) return this.parseNumber();
    throw new StrictJsonSyntaxError(`unexpected character "${c}"`, this.pos);
  }

  private parseLiteral(literal: string, value: unknown): unknown {
    if (this.text.slice(this.pos, this.pos + literal.length) !== literal) throw new StrictJsonSyntaxError(`expected literal "${literal}"`, this.pos);
    this.pos += literal.length;
    return value;
  }

  private parseNumber(): number {
    const start = this.pos;
    if (this.text[this.pos] === "-") this.pos++;
    while (this.pos < this.text.length && this.text[this.pos]! >= "0" && this.text[this.pos]! <= "9") this.pos++;
    if (this.text[this.pos] === ".") {
      this.pos++;
      while (this.pos < this.text.length && this.text[this.pos]! >= "0" && this.text[this.pos]! <= "9") this.pos++;
    }
    if (this.text[this.pos] === "e" || this.text[this.pos] === "E") {
      this.pos++;
      if (this.text[this.pos] === "+" || this.text[this.pos] === "-") this.pos++;
      while (this.pos < this.text.length && this.text[this.pos]! >= "0" && this.text[this.pos]! <= "9") this.pos++;
    }
    const raw = this.text.slice(start, this.pos);
    if (raw === "" || raw === "-") throw new StrictJsonSyntaxError("invalid number", start);
    return Number(raw);
  }

  private parseString(): string {
    this.expect('"');
    let out = "";
    for (;;) {
      const c = this.peek();
      if (c === '"') {
        this.pos++;
        return out;
      }
      if (c === "\\") {
        this.pos++;
        const esc = this.peek();
        this.pos++;
        switch (esc) {
          case '"':
            out += '"';
            break;
          case "\\":
            out += "\\";
            break;
          case "/":
            out += "/";
            break;
          case "b":
            out += "\b";
            break;
          case "f":
            out += "\f";
            break;
          case "n":
            out += "\n";
            break;
          case "r":
            out += "\r";
            break;
          case "t":
            out += "\t";
            break;
          case "u": {
            const hex = this.text.slice(this.pos, this.pos + 4);
            if (!/^[0-9a-fA-F]{4}$/.test(hex)) throw new StrictJsonSyntaxError("invalid \\u escape", this.pos);
            out += String.fromCharCode(parseInt(hex, 16));
            this.pos += 4;
            break;
          }
          default:
            throw new StrictJsonSyntaxError(`invalid escape "\\${esc}"`, this.pos);
        }
        continue;
      }
      if (c.charCodeAt(0) < 0x20) throw new StrictJsonSyntaxError("unescaped control character in string", this.pos);
      out += c;
      this.pos++;
    }
  }

  private parseObject(path: string): Record<string, unknown> {
    this.expect("{");
    const result: Record<string, unknown> = {};
    const seenKeys = new Set<string>();
    this.skipWhitespace();
    if (this.peek() === "}") {
      this.pos++;
      return result;
    }
    for (;;) {
      this.skipWhitespace();
      const keyStart = this.pos;
      const key = this.parseString();
      if (seenKeys.has(key)) throw new DuplicateJsonKeyError(key, path, keyStart);
      seenKeys.add(key);
      this.skipWhitespace();
      this.expect(":");
      const value = this.parseValue(`${path}.${key}`);
      result[key] = value;
      this.skipWhitespace();
      const c = this.peek();
      if (c === ",") {
        this.pos++;
        continue;
      }
      if (c === "}") {
        this.pos++;
        return result;
      }
      throw new StrictJsonSyntaxError(`expected "," or "}" in object`, this.pos);
    }
  }

  private parseArray(path: string): unknown[] {
    this.expect("[");
    const result: unknown[] = [];
    this.skipWhitespace();
    if (this.peek() === "]") {
      this.pos++;
      return result;
    }
    let index = 0;
    for (;;) {
      const value = this.parseValue(`${path}[${index}]`);
      result.push(value);
      index++;
      this.skipWhitespace();
      const c = this.peek();
      if (c === ",") {
        this.pos++;
        continue;
      }
      if (c === "]") {
        this.pos++;
        return result;
      }
      throw new StrictJsonSyntaxError(`expected "," or "]" in array`, this.pos);
    }
  }
}

/** Parses `text` as JSON, throwing `DuplicateJsonKeyError` if any object literal repeats a key (never silently keeping only the last occurrence, unlike `JSON.parse`). */
export function parseStrictJson(text: string): unknown {
  return new Parser(text).parse();
}
