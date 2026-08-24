/**
 * CC-11.8 §20 two-asset proof: the two chosen already-READY, genuinely
 * reference-locked Unit 202 assets (task brief E1). `unit202.pulleys.fixed`
 * was the original second candidate but was found REFERENCE_UNSUITABLE on
 * actual inspection (its cited Pulley1a.svg reference depicts a compound
 * fixed+movable block-and-tackle system, which the asset's own
 * `prohibitedChanges` explicitly forbids -- "do NOT introduce
 * block-and-tackle complexity") and was swapped for `unit202.levers.class-1`
 * per the brief's own contingency instruction, without performing broad new
 * reference research.
 */

export interface ProofAssetSpec {
  assetId: string;
  referenceUrl: string;
  /** Set only when the reference file's frame contains more geometry than this one asset should depict -- states exactly which part is authoritative and which to ignore. */
  referenceExtractionNote?: string;
}

export const PROOF_ASSETS: ProofAssetSpec[] = [
  {
    assetId: "unit202.magnet.field",
    referenceUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/DipolMagnet.svg",
  },
  {
    assetId: "unit202.levers.class-1",
    referenceUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Lever_(PSF).svg",
    referenceExtractionNote:
      "The reference file contains three separate lever-class diagrams stacked vertically (Class I on top, Class II in the middle, Class III at the bottom). Use ONLY the TOP diagram as the technical reference: a straight bar with the fulcrum positioned BETWEEN the effort arrow (left end) and the resistance/load box (right end). Ignore the middle and bottom diagrams entirely -- they show Class II and Class III, genuinely different lever configurations this asset must never depict.",
  },
];

export function proofAssetSpec(assetId: string): ProofAssetSpec {
  const spec = PROOF_ASSETS.find((p) => p.assetId === assetId);
  if (!spec) throw new Error(`No proof spec registered for ${assetId}. Registered: ${PROOF_ASSETS.map((p) => p.assetId).join(", ")}`);
  return spec;
}
