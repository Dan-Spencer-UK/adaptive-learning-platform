/**
 * CC-05D: versioned prompt templates for the two-pass semantic visual
 * review (design authority: docs/architecture/CC-05D-INSTRUCTIONAL-
 * VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md §G). Prompts are governed,
 * versioned tooling, never scattered ad hoc strings -- changing the
 * template text of either prompt requires bumping its version constant,
 * which invalidates every cached semantic audit that used the old
 * version (see ../audit-cache.ts).
 */

export const PASS_A_PROMPT_VERSION = "pass-a.v1";
export const PASS_B_PROMPT_VERSION = "pass-b.v1";

export interface PassAPromptContext {
  readonly domain: string;
  readonly visualType: string;
}

/**
 * Deliberately withholds the contract's expected semantics (mustShow,
 * semanticMappings, expected direction, ...) -- the whole point of Pass
 * A is an independent, unbiased read of the image, so a reviewer told
 * "this should show a hand whose thumb points X" before looking is far
 * more likely to simply report seeing exactly that, whether true or not.
 */
export function buildPassAPrompt(context: PassAPromptContext): string {
  return [
    "You are reviewing one instructional visual from a vocational-qualification learning application.",
    `Domain: ${context.domain}. Visual type: ${context.visualType}.`,
    "Describe only what you actually observe in the image. Do not guess what it is 'supposed' to show -- you have not been told.",
    "Return a single JSON object matching this exact shape (no prose outside the JSON):",
    "{",
    '  "visibleObjects": string[],',
    '  "visibleLabels": string[],',
    '  "arrows": { "description": string, "approximateDirection"?: string }[],',
    '  "apparentTopology"?: string,',
    '  "apparentRelationships": string[],',
    '  "rotationSense": "clockwise" | "counterclockwise" | "not_applicable" | "indeterminate",',
    '  "labelsOverlap": boolean,',
    '  "anyClipping": boolean,',
    '  "arrowsAppearAttachedToLabelledObject": boolean,',
    '  "ambiguityNotes": string[],',
    '  "legibilityConcerns": string[]',
    "}",
  ].join("\n");
}

export interface PassBPromptContext {
  readonly variantId: string;
  readonly mode: "teaching" | "assessment" | "both";
}

/**
 * Receives Pass A's observations plus the full governed contract and
 * independently judges whether the observed visual satisfies it.
 */
export function buildPassBPrompt(
  observationJson: string,
  contractJson: string,
  context: PassBPromptContext,
): string {
  return [
    "You previously produced (or have been given) a blind observation of one instructional visual. You are now told what it is supposed to teach.",
    `Variant: ${context.variantId}. Mode: ${context.mode}.`,
    "Blind observation (Pass A):",
    observationJson,
    "Governed visual semantic contract (what the image is supposed to show/mean):",
    contractJson,
    "Compare the observation against the contract. In assessment mode, any element the contract lists in answerDisclosure but does NOT permit in this mode must be treated as answer leakage if it appears to have been observed.",
    "Return a single JSON object matching this exact shape (no prose outside the JSON):",
    "{",
    '  "status": "pass" | "warn" | "fail",',
    '  "confidence": "high" | "medium" | "low",',
    '  "issues": { "code": string, "severity": "low"|"medium"|"high"|"critical", "expected": string, "observed": string, "explanation": string }[],',
    '  "possibleLearnerMisunderstanding": boolean,',
    '  "answerLeakage": boolean,',
    '  "requiresHumanReview": boolean',
    "}",
    "Use one of the governed issue codes only: missing_required_element, incorrect_element, incorrect_direction, incorrect_topology, incorrect_semantic_mapping, misleading_visual, label_collision, clipping, ambiguous_direction, ambiguous_relationship, answer_leakage, inaccessible_semantics, contradiction_with_assertion, contradiction_with_capability, wrong_teaching_aid, unexpected_element, illegible, unsupported_visual_type, reviewer_uncertain.",
    "Set confidence to 'medium' or 'low' whenever you are not confident -- do not report high confidence you do not actually have.",
  ].join("\n");
}
