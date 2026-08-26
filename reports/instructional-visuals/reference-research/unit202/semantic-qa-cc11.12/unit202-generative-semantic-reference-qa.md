# Unit 202 — Generative Visual Semantic Reference QA

Verbatim handover document for CC-11.12. Full per-entry detail is in the sibling `unit202-generative-semantic-reference-qa.json`/`.csv` in this directory (the machine-readable, actually-consumed remediation authority). This file is preserved for provenance only.

## Executive result

- Learner-visible generative outputs reviewed: **51 / 51**
- KEEP / KEEP WITH ANNOTATION: **29**
- REDO / REDO MINOR / REDO FAMILY: **22**

The prior automated `PASS` status is not accepted as final approval. Several failures originated upstream: the reference image/frame was relevant to the topic but was not semantically prepared for the exact learner-visible state before Gemini received it.

## Fundamental decision

> **REFERENCE SEMANTIC QA IS A HARD PRE-GENERATION GATE.** The exact pixels/frame supplied to the image model must be reviewed against the exact governed learner-visible state. The reviewer must state what is authoritative, what is removed, what must appear, and what the model must not infer.

Final acceptance requires three independent PASSes: **technical correctness**, **pedagogical clarity**, and **premium visual/product quality**.

See `unit202-generative-semantic-reference-qa.json` for the full 51-entry per-visualId table (reviewPage, decision, referenceDisposition, requiredAction, semanticFinding).
