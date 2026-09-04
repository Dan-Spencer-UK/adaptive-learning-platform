/**
 * CC-24 PA-review correction §3.A: `parseStrictJson` delegates ALL
 * grammar validity to native `JSON.parse` and adds ONLY duplicate-key
 * detection on top. These tests prove both halves genuinely work --
 * including the malformed-number cases the earlier hand-rolled parser
 * silently accepted.
 */
import { describe, expect, it } from "vitest";

import { DuplicateJsonKeyError, StrictJsonSyntaxError, parseStrictJson } from "./strict-json.ts";

describe("CC-24 PA-review correction §3.A -- strict JSON grammar (delegated to native JSON.parse)", () => {
  it("accepts genuinely valid JSON, including edge-case-but-legal numbers", () => {
    expect(parseStrictJson('{"a":1,"b":-1,"c":0,"d":1.5,"e":1e10,"f":1.5e-10,"g":0.5}')).toEqual({ a: 1, b: -1, c: 0, d: 1.5, e: 1e10, f: 1.5e-10, g: 0.5 });
  });

  it.each([
    ["leading zero", '{"a":01}'],
    ["trailing decimal point with no digits after it", '{"a":1.}'],
    ["exponent with no digits", '{"a":1e}'],
    ["negative leading zero", '{"a":-01}'],
    ["trailing content after the top-level value", '{"a":1}garbage'],
    ["a JS-style line comment (not valid JSON)", '{"a":1 // comment\n}'],
    ["a JS-style block comment (not valid JSON)", '{"a":/* comment */1}'],
    ["a trailing comma", '{"a":1,}'],
    ["an unquoted key", "{a:1}"],
    ["single-quoted string", "{'a':1}"],
  ])("rejects malformed JSON: %s", (_label, text) => {
    expect(() => parseStrictJson(text)).toThrow(StrictJsonSyntaxError);
  });

  it("rejects a duplicate key in a flat object", () => {
    expect(() => parseStrictJson('{"a":1,"a":2}')).toThrow(DuplicateJsonKeyError);
  });

  it("rejects a duplicate key nested inside an array of objects", () => {
    expect(() => parseStrictJson('{"items":[{"x":1},{"y":1,"y":2}]}')).toThrow(DuplicateJsonKeyError);
  });

  it("rejects a duplicate key even when separated by a nested object/array value", () => {
    expect(() => parseStrictJson('{"a":{"nested":[1,2,3]},"a":2}')).toThrow(DuplicateJsonKeyError);
  });

  it("does not false-positive on the SAME key name reused in DIFFERENT (non-nested, sibling) objects", () => {
    expect(() => parseStrictJson('{"items":[{"id":1},{"id":2}]}')).not.toThrow();
  });

  it("does not false-positive on a key whose STRING VALUE contains brace/bracket/comma characters", () => {
    expect(() => parseStrictJson('{"a":"{not a key}, [neither], \\"nor this\\""}')).not.toThrow();
    expect(parseStrictJson('{"a":"{not a key}, [neither], \\"nor this\\""}')).toEqual({ a: '{not a key}, [neither], "nor this"' });
  });

  it("does not false-positive on a key equal to a JSON keyword substring or containing escaped unicode", () => {
    expect(() => parseStrictJson('{"true":1,"a\\u0062c":2}')).not.toThrow();
  });
});
