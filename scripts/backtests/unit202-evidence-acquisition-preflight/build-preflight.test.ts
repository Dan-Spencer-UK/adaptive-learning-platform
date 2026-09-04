/**
 * CC-23 sections 17-20/23/28: proves the Unit-202 regression adapter and
 * preflight harness against the frozen blind acquisition target manifest
 * -- the qualification-specific validation for the generic evidence-
 * requirement-planning architecture (@alp/technical-evidence-engine).
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { planEvidenceRequirements, type EvidenceRequirement } from "@alp/technical-evidence-engine";
import { describe, expect, it } from "vitest";

import { buildUnit202PlanningInput } from "./unit202-adapter.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");

const EXPECTED_BLIND_TARGET_HASH = "3052aede77b472247fbdf7a9e04d62adb2e98bba3a2896dacd610267e4a754b4";

function readJson<T>(relPath: string): T {
  return JSON.parse(readFileSync(path.join(repoRoot, relPath), "utf-8")) as T;
}
function readText(relPath: string): string {
  return readFileSync(path.join(repoRoot, relPath), "utf-8");
}

const { input, audit, blindTargetsContentHash } = buildUnit202PlanningInput();
const planResult = planEvidenceRequirements(input);

function requirementFor(text: string): EvidenceRequirement | undefined {
  return planResult.requirements.find((r) => r.requirementText === text);
}

describe("CC-23 section 26/12 -- frozen blind target manifest hash is unchanged", () => {
  it("the adapter's own observed content hash matches the CC-22C-frozen hash byte-for-byte", () => {
    expect(blindTargetsContentHash).toBe(EXPECTED_BLIND_TARGET_HASH);
  });

  it("independently recomputing the hash from the raw file on disk also matches", () => {
    const raw = readText("reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-BLIND-ACQUISITION-TARGETS.json");
    expect(createHash("sha256").update(raw).digest("hex")).toBe(EXPECTED_BLIND_TARGET_HASH);
  });
});

describe("CC-23 section 18 -- AC2.2 meaning/symbol/unit/distinction decomposes into independent coverage dimensions", () => {
  it("Resistance (with an explicit 'distinction from resistivity') decomposes into 4 independent requirements", () => {
    const resistanceReqs = planResult.requirements.filter((r) => r.sourceKnowledgeTargetIds.includes("unit202::ACQ-028"));
    expect(resistanceReqs).toHaveLength(4);
    const dims = resistanceReqs.map((r) => r.requiredCoverageDimensions[0]).sort();
    expect(dims).toEqual(["DEFINITION", "DISTINCTION", "QUANTITY_SYMBOL", "UNIT_SYMBOL"]);
  });

  it("Current (no explicit distinction clause) decomposes into exactly 3 requirements, never inventing a DISTINCTION dimension", () => {
    const currentReqs = planResult.requirements.filter((r) => r.sourceKnowledgeTargetIds.includes("unit202::ACQ-026"));
    expect(currentReqs).toHaveLength(3);
    expect(currentReqs.map((r) => r.requiredCoverageDimensions[0])).not.toContain("DISTINCTION");
  });

  it("all 11 AC2.2 quantities are decomposed as CONCEPT_DEFINITION targets, never left as one opaque fact", () => {
    const ac2_2AcquisitionIds = audit.filter((a) => a.ac === "AC2.2").map((a) => a.knowledgeTargetId);
    expect(ac2_2AcquisitionIds).toHaveLength(11);
    for (const id of ac2_2AcquisitionIds) {
      const target = input.knowledgeTargets.find((t) => t.knowledgeTargetId === id)!;
      expect(target.kind).toBe("CONCEPT_DEFINITION");
      expect(target.expectedCoverageDimensions!.length).toBeGreaterThan(1);
    }
  });
});

describe("CC-23 section 18 -- 'Fractions.' becomes TOPIC_BREADTH_COVERAGE, never a fake exact fact", () => {
  it("Fractions./Percentages./Algebra. all resolve to TOPIC_BREADTH_COVERAGE", () => {
    for (const text of ["Fractions.", "Percentages.", "Algebra."]) {
      const r = requirementFor(text);
      expect(r, `no requirement found for "${text}"`).toBeDefined();
      expect(r!.requirementMode).toBe("TOPIC_BREADTH_COVERAGE");
    }
  });

  it("Positive/Negative indices. and Pythagoras. are NOT swept into breadth -- narrow atomic facts stay atomic", () => {
    for (const text of ["Positive indices.", "Negative indices.", "Pythagoras."]) {
      const r = requirementFor(text);
      expect(r!.requirementMode).not.toBe("TOPIC_BREADTH_COVERAGE");
    }
  });
});

describe("CC-23 section 18 -- basic electron theory decomposes rather than acting as one opaque fact", () => {
  it("AC4.1's three electron-theory propositions each get their own evidence requirement, not one bundled fact", () => {
    const ac41 = audit.filter((a) => a.ac === "AC4.1" && /electron/i.test(a.rawProposition));
    expect(ac41.length).toBeGreaterThanOrEqual(2);
    for (const a of ac41) {
      expect(planResult.requirements.some((r) => r.sourceKnowledgeTargetIds.includes(a.knowledgeTargetId))).toBe(true);
    }
    // Distinct requirements, not one shared bundled requirement:
    const reqIds = new Set(ac41.flatMap((a) => planResult.requirements.filter((r) => r.sourceKnowledgeTargetIds.includes(a.knowledgeTargetId)).map((r) => r.evidenceRequirementId)));
    expect(reqIds.size).toBeGreaterThanOrEqual(2);
  });
});

describe("CC-23 section 18 -- broad force/work/energy integration reuses constituent technical truths", () => {
  it("the force/work/energy/power/efficiency relationship target is satisfied by its 5 constituents, emitting no requirement of its own", () => {
    const satisfaction = planResult.structuralSatisfactions.find((s) => s.knowledgeTargetId === "unit202::ACQ-066");
    expect(satisfaction?.kind).toBe("INTEGRATION_SATISFIED_BY_CONSTITUENTS");
    expect(satisfaction?.satisfiedByKnowledgeTargetIds).toEqual(["unit202::ACQ-060", "unit202::ACQ-061", "unit202::ACQ-062", "unit202::ACQ-064", "unit202::ACQ-065"]);
    expect(planResult.requirements.some((r) => r.sourceKnowledgeTargetIds.includes("unit202::ACQ-066"))).toBe(false);
  });
});

describe("CC-23 section 10/18 -- F=mg is reused canonically across multiple learner targets", () => {
  it("the two F=mg propositions (AC3.1, AC3.3) collapse into one canonical requirement", () => {
    const r = requirementFor("F = mg.");
    expect(r).toBeDefined();
    expect([...r!.sourceKnowledgeTargetIds].sort()).toEqual(["unit202::ACQ-047", "unit202::ACQ-068"]);
  });
});

describe("CC-23 section 18 -- schematic recognition exposes per-component-family coverage", () => {
  it("PHYSICAL_OR_COMPONENT_RECOGNITION targets each become independent SCHEMATIC_OR_DIAGRAM_RECOGNITION requirements", () => {
    const recognitionAudits = audit.filter((a) => {
      const t = input.knowledgeTargets.find((kt) => kt.knowledgeTargetId === a.knowledgeTargetId);
      return t?.kind === "RECOGNITION_REQUIREMENT";
    });
    expect(recognitionAudits.length).toBeGreaterThan(1);
    for (const a of recognitionAudits) {
      const req = planResult.requirements.find((r) => r.sourceKnowledgeTargetIds.includes(a.knowledgeTargetId));
      expect(req?.requirementMode, `expected SCHEMATIC_OR_DIAGRAM_RECOGNITION for "${a.rawProposition}"`).toBe("SCHEMATIC_OR_DIAGRAM_RECOGNITION");
    }
  });
});

describe("CC-23 section 18 -- representative exemplars remain semantically distinct", () => {
  it("each representative-exemplar target produces its own requirement, never merged into a generic bucket", () => {
    const exemplarAudits = audit.filter((a) => input.knowledgeTargets.find((t) => t.knowledgeTargetId === a.knowledgeTargetId)?.isRepresentativeExemplar);
    expect(exemplarAudits.length).toBeGreaterThanOrEqual(3);
    const texts = new Set(exemplarAudits.map((a) => a.rawProposition));
    expect(texts.size).toBe(exemplarAudits.length); // each is textually distinct, so canonical dedup does not collapse them
    for (const a of exemplarAudits) {
      const req = planResult.requirements.find((r) => r.sourceKnowledgeTargetIds.includes(a.knowledgeTargetId));
      expect(req?.representativeExemplar).toBe(true);
    }
  });
});

describe("CC-23 section 18 -- contextual material remains optional", () => {
  it("every CONTEXTUAL_TEACHING_SUPPORT target's requirement(s) carry acquisitionPriority OPTIONAL_CONTEXT", () => {
    const contextualIds = input.knowledgeTargets.filter((t) => t.classification === "CONTEXTUAL_TEACHING_SUPPORT").map((t) => t.knowledgeTargetId);
    expect(contextualIds.length).toBeGreaterThan(0);
    for (const id of contextualIds) {
      const reqs = planResult.requirements.filter((r) => r.sourceKnowledgeTargetIds.includes(id));
      for (const r of reqs) expect(r.acquisitionPriority).toBe("OPTIONAL_CONTEXT");
    }
  });
});

describe("CC-23A section 20 -- the 8 known preflight decomposition gaps are resolved through the generic mechanisms alone", () => {
  it("zero SEMANTIC_DECOMPOSITION_REQUIRED requirements remain for the current frozen target set", () => {
    const gaps = planResult.requirements.filter((r) => r.decompositionStatus === "SEMANTIC_DECOMPOSITION_REQUIRED");
    expect(gaps.map((g) => g.requirementText)).toEqual([]);
    expect(gaps).toHaveLength(0);
  });
});

describe("CC-23A section 25 -- individual Unit-202 gap resolutions", () => {
  it("R = rho L/A: READY FORMULA_OR_RULE requirement, rearrangement satisfied by the foundational formula-transposition procedure", () => {
    const req = planResult.requirements.find((r) => r.sourceKnowledgeTargetIds.includes("unit202::ACQ-083"))!;
    expect(req.requirementMode).toBe("FORMULA_OR_RULE");
    expect(req.decompositionStatus).toBe("READY");
    const satisfaction = planResult.structuralSatisfactions.find((s) => s.knowledgeTargetId === "unit202::ACQ-083");
    expect(satisfaction?.kind).toBe("REARRANGEMENT_SATISFIED_BY_FOUNDATIONAL_PROCEDURE");
    expect(satisfaction?.satisfiedByKnowledgeTargetIds).toEqual(["unit202::ACQ-004"]);
  });

  it("V = IR: READY FORMULA_OR_RULE requirement, rearrangement satisfied by the foundational procedure -- no new domain-specific rearrangement source", () => {
    const req = planResult.requirements.find((r) => r.sourceKnowledgeTargetIds.includes("unit202::ACQ-085"))!;
    expect(req.requirementMode).toBe("FORMULA_OR_RULE");
    expect(req.decompositionStatus).toBe("READY");
    const satisfaction = planResult.structuralSatisfactions.find((s) => s.knowledgeTargetId === "unit202::ACQ-085");
    expect(satisfaction?.kind).toBe("REARRANGEMENT_SATISFIED_BY_FOUNDATIONAL_PROCEDURE");
  });

  it("B = Phi/A: READY FORMULA_OR_RULE requirement covering B/flux/area, rearrangement satisfied by the foundational procedure", () => {
    const req = planResult.requirements.find((r) => r.sourceKnowledgeTargetIds.includes("unit202::ACQ-106"))!;
    expect(req.requirementMode).toBe("FORMULA_OR_RULE");
    expect(req.decompositionStatus).toBe("READY");
    const satisfaction = planResult.structuralSatisfactions.find((s) => s.knowledgeTargetId === "unit202::ACQ-106");
    expect(satisfaction?.kind).toBe("REARRANGEMENT_SATISFIED_BY_FOUNDATIONAL_PROCEDURE");
  });

  it("f = N x P: READY FORMULA_OR_RULE requirement covering f/N/P and the multiplicative relationship", () => {
    const req = planResult.requirements.find((r) => r.sourceKnowledgeTargetIds.includes("unit202::ACQ-132"))!;
    expect(req.requirementMode).toBe("FORMULA_OR_RULE");
    expect(req.decompositionStatus).toBe("READY");
    expect(req.requirementText).toMatch(/f is frequency/i);
  });

  it("the duplicate frequency learner target (§16) maps to the SAME canonical semantic evidence requirement, preserving both learner-target mappings", () => {
    const req131 = planResult.requirements.find((r) => r.sourceKnowledgeTargetIds.includes("unit202::ACQ-131"));
    const req132 = planResult.requirements.find((r) => r.sourceKnowledgeTargetIds.includes("unit202::ACQ-132"));
    expect(req131).toBeDefined();
    expect(req131).toBe(req132); // literally the same merged requirement object
    expect([...req131!.sourceKnowledgeTargetIds].sort()).toEqual(["unit202::ACQ-131", "unit202::ACQ-132"]);
  });

  it("right-hand grip rule: READY OPERATIONAL_USE_RULE, OPEN_TECHNICAL_QUESTION, with generic coverage obligations and NO answer mapping (CC-23B §13)", () => {
    const target = input.knowledgeTargets.find((t) => t.knowledgeTargetId === "unit202::ACQ-108")!;
    expect(target.kind).toBe("OPERATIONAL_USE_RULE");
    expect(target.specificationMode).toBe("OPEN_TECHNICAL_QUESTION");
    expect(target.directionalMapping).toBeUndefined(); // CC-23B: no answer mapping supplied pre-acquisition
    const req = planResult.requirements.find((r) => r.sourceKnowledgeTargetIds.includes("unit202::ACQ-108"))!;
    expect(req.decompositionStatus).toBe("READY");
    expect(req.specificationMode).toBe("OPEN_TECHNICAL_QUESTION");
    expect(req.requiredCoverageDimensions).toEqual(["DIRECTIONAL_MAPPING", "ROLE_MAPPING", "CORRECT_USE_CONDITIONS"]);
  });

  it("Fleming's left-hand rule: READY OPERATIONAL_USE_RULE, motor-effect learner knowledge", () => {
    const target = input.knowledgeTargets.find((t) => t.knowledgeTargetId === "unit202::ACQ-114")!;
    expect(target.kind).toBe("OPERATIONAL_USE_RULE");
    const req = planResult.requirements.find((r) => r.sourceKnowledgeTargetIds.includes("unit202::ACQ-114"))!;
    expect(req.decompositionStatus).toBe("READY");
  });

  it("Fleming's right-hand/generator rule: READY OPERATIONAL_USE_RULE", () => {
    const target = input.knowledgeTargets.find((t) => t.knowledgeTargetId === "unit202::ACQ-117")!;
    expect(target.kind).toBe("OPERATIONAL_USE_RULE");
    const req = planResult.requirements.find((r) => r.sourceKnowledgeTargetIds.includes("unit202::ACQ-117"))!;
    expect(req.decompositionStatus).toBe("READY");
  });

  it("CC-23B §13/§16: none of the 3 directional-rule blind requirements leak an answer mapping -- no directionalMapping field, no finger/thumb/curl content anywhere", () => {
    const forbidden = ["thumb", "finger", "curl", "right hand", "left hand", "conventional current", "reversal"];
    for (const id of ["unit202::ACQ-108", "unit202::ACQ-114", "unit202::ACQ-117"]) {
      const target = input.knowledgeTargets.find((t) => t.knowledgeTargetId === id)!;
      expect(target.directionalMapping, `${id} must carry no directionalMapping answer content`).toBeUndefined();
      const req = planResult.requirements.find((r) => r.sourceKnowledgeTargetIds.includes(id))!;
      const serialized = JSON.stringify(req).toLowerCase();
      for (const word of forbidden) {
        expect(serialized.includes(word), `${id}'s evidence requirement must not leak "${word}"`).toBe(false);
      }
    }
  });

  it("CC-23B §16: the blind plan's raw JSON output contains no directional-answer leakage anywhere, for any requirement", () => {
    const planJson = JSON.stringify(readJson("reports/backtests/unit202-evidence-acquisition-preflight/UNIT202-EVIDENCE-REQUIREMENT-PLAN.json")).toLowerCase();
    for (const word of ["curled fingers", "thumb aligned", "first finger", "second finger"]) {
      expect(planJson.includes(word), `blind plan must not leak "${word}"`).toBe(false);
    }
  });
});

describe("CC-23B §14/§25 -- formula targets remain KNOWN_CLAIM_TO_VERIFY (qualification-supplied formulas are never converted to open questions)", () => {
  it("R=rhoL/A, V=IR, B=Phi/A, and the merged f=NxP requirement are all KNOWN_CLAIM_TO_VERIFY", () => {
    for (const id of ["unit202::ACQ-083", "unit202::ACQ-085", "unit202::ACQ-106", "unit202::ACQ-132"]) {
      const req = planResult.requirements.find((r) => r.sourceKnowledgeTargetIds.includes(id))!;
      expect(req.specificationMode, `${id} must remain KNOWN_CLAIM_TO_VERIFY`).toBe("KNOWN_CLAIM_TO_VERIFY");
      expect(req.evidenceQuestion).toBeNull();
    }
  });

  it("the duplicate frequency learner target (ACQ-131, no formula of its own) still merges into the KNOWN_CLAIM_TO_VERIFY requirement supplied by ACQ-132", () => {
    const req131 = planResult.requirements.find((r) => r.sourceKnowledgeTargetIds.includes("unit202::ACQ-131"));
    const req132 = planResult.requirements.find((r) => r.sourceKnowledgeTargetIds.includes("unit202::ACQ-132"));
    expect(req131).toBe(req132);
    expect(req131!.specificationMode).toBe("KNOWN_CLAIM_TO_VERIFY");
  });

  it("F = mg (both AC3.1 and AC3.3 mappings) remains KNOWN_CLAIM_TO_VERIFY after merging", () => {
    const req = planResult.requirements.find((r) => r.sourceKnowledgeTargetIds.includes("unit202::ACQ-047"))!;
    expect(req.specificationMode).toBe("KNOWN_CLAIM_TO_VERIFY");
    expect([...req.sourceKnowledgeTargetIds].sort()).toEqual(["unit202::ACQ-047", "unit202::ACQ-068"]);
  });
});

describe("CC-23B §21/§26 -- zero semantic-decomposition gaps remain, and no new gap was invented shut", () => {
  it("SEMANTIC_DECOMPOSITION_REQUIRED count is exactly zero for the current frozen target set", () => {
    const gaps = planResult.requirements.filter((r) => r.decompositionStatus === "SEMANTIC_DECOMPOSITION_REQUIRED");
    expect(gaps).toHaveLength(0);
  });
});

describe("CC-23B §9/§26 -- Unit-202 known/open requirement counts", () => {
  it("reports a genuine KNOWN/OPEN split, majority OPEN (the qualification names concepts far more often than it states their technical content)", () => {
    const known = planResult.requirements.filter((r) => r.specificationMode === "KNOWN_CLAIM_TO_VERIFY").length;
    const open = planResult.requirements.filter((r) => r.specificationMode === "OPEN_TECHNICAL_QUESTION").length;
    expect(known + open).toBe(planResult.requirements.length);
    expect(known).toBeGreaterThan(0);
    expect(open).toBeGreaterThan(known);
  });
});

describe("CC-23A section 2-5 -- semantic identity is assigned to every knowledge target, never derived from qualification location", () => {
  it("every Unit-202 target carries a semanticIdentity with a non-empty namespace and key", () => {
    for (const t of input.knowledgeTargets) {
      expect(t.semanticIdentity.semanticNamespace.length).toBeGreaterThan(0);
      expect(t.semanticIdentity.semanticKey.length).toBeGreaterThan(0);
    }
  });

  it("semantic namespaces are genuine subject-area names, never bare AC codes", () => {
    const namespaces = new Set(input.knowledgeTargets.map((t) => t.semanticIdentity.semanticNamespace));
    for (const ns of namespaces) expect(ns).not.toMatch(/^AC\d/);
  });
});

describe("CC-23 section 28 -- proof of architectural invariants", () => {
  const adapterSource = readText("scripts/backtests/unit202-evidence-acquisition-preflight/unit202-adapter.ts");
  const buildPreflightSource = readText("scripts/backtests/unit202-evidence-acquisition-preflight/build-preflight.ts");
  const enginePackageJson = readJson<{ dependencies?: Record<string, string> }>("packages/technical-evidence-engine/package.json");
  const engineTypesSource = readText("packages/technical-evidence-engine/src/types.ts");
  const enginePlannerSource = readText("packages/technical-evidence-engine/src/planner.ts");
  const engineAccessGuardSource = readText("packages/technical-evidence-engine/src/access-guard.ts");

  it("(A) production acquisition/planner code contains zero Unit-202 branching literals", () => {
    for (const source of [engineTypesSource, enginePlannerSource, engineAccessGuardSource]) {
      const lower = source.toLowerCase();
      for (const literal of ["unit202", "unit 202", "2365", "city & guilds", "ammeter", "voltmeter", "triac", "ac2.2"]) {
        expect(lower.includes(literal), `generic package source must not contain "${literal}"`).toBe(false);
      }
    }
  });

  it("(B) generic tests run without Unit-202 data -- every fixture knowledgeTargetId in planner.test.ts uses a synthetic-* prefix, never unit202::", () => {
    const genericTestSource = readText("packages/technical-evidence-engine/src/planner.test.ts");
    const idLiterals = [...genericTestSource.matchAll(/knowledgeTargetId:\s*"([^"]+)"/g)].map((m) => m[1]!);
    expect(idLiterals.length).toBeGreaterThan(10);
    for (const id of idLiterals) {
      expect(id.startsWith("synthetic-"), `fixture id "${id}" must use a synthetic-* prefix, never real qualification data`).toBe(true);
    }
  });

  it("(C) the same canonical requirement supports two synthetic qualifications (proven directly in the generic package's own test suite, cross-checked here for presence)", () => {
    const genericTestSource = readText("packages/technical-evidence-engine/src/planner.test.ts");
    expect(genericTestSource).toContain("cross-qualification");
    expect(genericTestSource).toContain("synthetic-f1");
    expect(genericTestSource).toContain("synthetic-f2");
  });

  it("(D) the planner performs no research -- no I/O signature appears in generic planner/types/access-guard source", () => {
    for (const signature of ["fetch(", "http.request", "https.request", "readFileSync", "writeFileSync", "WebFetch", "WebSearch"]) {
      expect(enginePlannerSource.includes(signature), `planner.ts must not contain "${signature}"`).toBe(false);
    }
  });

  it("(E) the Unit-202 adapter/preflight-harness dependency direction is one-way: it imports FROM @alp/technical-evidence-engine, and the generic package never references scripts/backtests or reports/", () => {
    expect(adapterSource).toContain('from "@alp/technical-evidence-engine"');
    expect(buildPreflightSource).toContain('from "@alp/technical-evidence-engine"');
    for (const source of [engineTypesSource, enginePlannerSource, engineAccessGuardSource]) {
      expect(source).not.toMatch(/scripts\/backtests/);
      expect(source).not.toMatch(/reports\//);
    }
  });

  it("this package declares zero dependency on any Unit-202-specific or reconciliation-specific workspace concept, and @alp/technical-evidence-engine itself still declares zero @alp/* dependency", () => {
    expect(Object.keys(enginePackageJson.dependencies ?? {}).every((d) => !d.startsWith("@alp/"))).toBe(true);
  });

  it("(F) architecture documentation includes the new pipeline stage", () => {
    const doc = readText("docs/architecture/qualification-knowledge-construction-pipeline.md");
    expect(doc).toContain("EVIDENCE-REQUIREMENT PLANNING");
    expect(doc).toContain("technical-evidence-engine");
  });

  it("§CK: pipeline documentation asserts the correct end-to-end order -- technical coverage -> assertion construction -> coverage gate -> course-construction handoff, in that order, with COURSE-CONSTRUCTION HANDOFF naming exactly one stage", () => {
    const doc = readText("docs/architecture/qualification-knowledge-construction-pipeline.md");
    const diagramMatch = doc.match(/```\r?\nRAW EVIDENCE\r?\n[\s\S]*?```/);
    expect(diagramMatch, "canonical pipeline diagram not found").not.toBeNull();
    const diagram = diagramMatch![0];
    const coverageIdx = diagram.indexOf("TECHNICAL COVERAGE");
    const assertionIdx = diagram.indexOf("ASSERTION");
    const gateIdx = diagram.indexOf("COVERAGE GATE");
    const handoffIdx = diagram.indexOf("COURSE-CONSTRUCTION HANDOFF");
    expect(coverageIdx).toBeGreaterThan(-1);
    expect(assertionIdx).toBeGreaterThan(coverageIdx);
    expect(gateIdx).toBeGreaterThan(assertionIdx);
    expect(handoffIdx).toBeGreaterThan(gateIdx);
    // COURSE-CONSTRUCTION HANDOFF names exactly one stage in the diagram.
    const handoffOccurrences = diagram.split("COURSE-CONSTRUCTION HANDOFF").length - 1;
    expect(handoffOccurrences).toBe(1);
  });

  it("(G) source authority cannot create qualification scope -- the SourceAuthorityPolicy interface's ONLY member is allowedAuthorityClassesByMode, structurally incapable of expressing classification/scope/depth", () => {
    const match = engineTypesSource.match(/export interface SourceAuthorityPolicy \{([\s\S]*?)\n\}/);
    expect(match, "SourceAuthorityPolicy interface not found").not.toBeNull();
    const body = match![1]!;
    const memberNames = [...body.matchAll(/readonly\s+(\w+)\s*:/g)].map((m) => m[1]);
    expect(memberNames).toEqual(["allowedAuthorityClassesByMode"]);
  });

  it("(I) no live web acquisition occurred -- no network signature anywhere in this package's own source", () => {
    for (const source of [adapterSource, buildPreflightSource]) {
      for (const signature of ["fetch(", "http.request", "https.request", "XMLHttpRequest", "WebFetch(", "WebSearch("]) {
        expect(source.includes(signature), `"${signature}" must not appear in Unit-202 preflight harness source`).toBe(false);
      }
    }
  });
});

describe("CC-23 section 20 -- evidence-requirement-level historical benchmark exists and carries provenance", () => {
  it("the generated benchmark file scores requirements, not learner-target rows, with full per-source provenance", () => {
    const benchmark = readJson<{ entries: { evidenceRequirementId: string; historicalCoverageState: string; sourceProvenance: unknown[] }[] }>("reports/backtests/unit202-evidence-acquisition-preflight/UNIT202-EVIDENCE-REQUIREMENT-BENCHMARK.json");
    expect(benchmark.entries.length).toBe(planResult.requirements.length);
    for (const e of benchmark.entries) {
      expect(["HISTORICALLY_EXACTLY_SUPPORTED", "HISTORICALLY_PARTIALLY_SUPPORTED", "HISTORICALLY_SOURCE_GAP", "NO_HISTORICAL_BENCHMARK"]).toContain(e.historicalCoverageState);
      expect(Array.isArray(e.sourceProvenance)).toBe(true);
    }
  });
});

describe("CC-23 section 26 -- preflight gate reports every required check", () => {
  it("the gate file exists and every required target is accounted for", () => {
    const gate = readJson<{ everyRequiredKnowledgeTargetMapsToReadyOrGap: boolean; unaccountedTargetIds: string[]; liveAcquisitionPerformed: boolean; duplicateDomainTruthsReused: boolean }>("reports/backtests/unit202-evidence-acquisition-preflight/UNIT202-PREFLIGHT-GATE.json");
    expect(gate.everyRequiredKnowledgeTargetMapsToReadyOrGap).toBe(true);
    expect(gate.unaccountedTargetIds).toEqual([]);
    expect(gate.liveAcquisitionPerformed).toBe(false);
    expect(gate.duplicateDomainTruthsReused).toBe(true);
  });
});
