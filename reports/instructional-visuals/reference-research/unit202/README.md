# Unit 202 reference handover package

Files:
- `unit202-reference-handover.json` — authoritative machine-readable handover, preserving the original 53-row catalogue and adding `externalResearch` to every asset.
- `unit202-reference-handover.csv` — compact review/import table.
- `unit202-reference-handover.md` — full human-readable per-asset appraisal.
- `unit202-reference-handover-summary.md` — decisions and critical corrections.
- `unit202-reference-implementation-checklist.json` — concise Claude Code implementation checklist.

The handover does not itself download/copy third-party reference files. Claude Code should acquire them from the recorded source URLs, verify licence/provenance, store the actual reference bytes, create specified crops/reference sheets, and then generate artwork.
