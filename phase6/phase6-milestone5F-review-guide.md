# Phase 6 Milestone 5F — Fluent-speaker review guide

15 November 2026 · Asia/Calcutta

## Status and scope

The worksheet contains all **51 Milestone 5E drafts across 10 categories**. Every Telugu draft remains **UNVERIFIED**. All four review criteria and every final approval status start **PENDING**. Blank reviewer, correction and approved-text fields are intentional. No human review, linguistic approval, audio permission or production integration has taken place.

Use `phase6-milestone5F-review-worksheet.csv` for a real fluent Telugu speaker's review. Preserve the three Milestone 5E files. This worksheet is a separate review artifact; editing it does not update game text, saves, triggers or voice permissions.

## Worksheet fields

- **Read-only originals:** dialogue ID, category, original Telugu dialogue, English meaning, original English source, trigger/context, tone/delivery, game-context verification, source review flags, slot bindings, source file/line and hashes. Do not overwrite these. “Original Telugu dialogue” means the original AI draft from 5E, not a verified movie quotation or an approved performance.
- **Grammar correctness:** assess agreement, inflection, sentence structure, spelling, punctuation and dynamic-slot grammar.
- **Natural Telugu fluency:** assess whether a fluent player would hear natural conversational language, including terminology and combat brevity. Do not certify fluency merely because script/grammar looks plausible.
- **Character consistency:** evaluate a confident, composed, observant, direct and supportive original assistant. Important story statements should be serious. Do not introduce movie catchphrases or imitate an actor's distinctive delivery.
- **Cultural/contextual accuracy:** check register, idioms and intended meaning against the actual game trigger. Do not invent cultural expressions, lore, events, missions or player actions to fill uncertainty.
- **Reviewer corrections:** latest proposed replacement text only. Leave the original draft untouched. A proposal is not an approval.
- **Reviewer comments:** reasons, uncertain words, alternatives, unresolved context and explanations of the assessment.
- **Correction history:** an append-only record of every proposed version and decision, retaining earlier text and assessments rather than replacing them.
- **Reviewer name / review date:** actual human reviewer's identity and actual review date, preferably YYYY-MM-DD. Do not enter an AI name or fictional reviewer. Identity alone does not prove a review happened.
- **Final approval status:** the human decision using exactly the allowed values below.
- **Human-approved Telugu text:** leave blank until a human explicitly approves the exact version. On approval, copy either the unchanged original or the final corrected version here. This does not replace the original or install it into the game.

The English meaning is an AI interpretation from 5E, not a certified translation. Compare the Telugu with both that meaning and the original game English/context. A source-verified trigger is not proof of fluent language or an observed event in the user's personal save.

## Allowed statuses

Use only these exact strings for the four criterion fields and the final approval field:

- **PENDING:** not reviewed, incomplete review, unresolved context, or awaiting an explicit human decision.
- **APPROVED:** an actual fluent human reviewer approves the exact reviewed version for the criterion or final decision.
- **NEEDS CORRECTION:** changes are needed or a proposed change awaits re-review.
- **REJECTED:** the reviewer rejects the current version, with a reason recorded separately.

Do not use PASS, VERIFIED, automatic scores or inferred approval in these status cells. The report's preparation PASS is not a dialogue approval.

## Human review procedure

1. Open the CSV as UTF-8 (with BOM); preserve Telugu, IDs, braces and quoted multiline fields when saving. CSV has no formatting or enforceable dropdowns, so status rules are manual. The preparation checks validate the initial file only; no future-review enforcement/import software was created.
2. Locate the original 5E entry by its unchanged ID. Verify the original text/hash and read the English source, intended meaning, trigger, tone, slot notes and existing language flags.
3. Review grammar, fluency, character and contextual accuracy. Until a correction is proposed, these fields refer to the original draft. If reviewing a proposed version, identify that version explicitly in comments/history. Preserve previous assessments in the history before changing them.
4. For each correction, keep the original untouched, place the current proposal in Reviewer corrections, and append the full proposal with version, date, actual reviewer, reason, prior assessment and decision to Correction history. Do not silently replace a previous proposal. Separate multiple versions with line breaks inside the quoted CSV cell; an external append-only review log keyed to the same dialogue ID may supplement it if needed.
5. Re-review the proposed version against the same source meaning and context. If the source itself is ambiguous, leave PENDING/NEEDS CORRECTION and describe the question. Do not guess an intended game capability or add dialogue for unsupported contexts.
6. Final APPROVED requires a real human review, all four criteria approved for the same exact version, reviewer name, actual date, explicit decision/comments, and the exact final text in Human-approved Telugu text. If any prerequisite is missing, leave final PENDING or NEEDS CORRECTION. A rejected version must retain its history.
7. The reviewer must not change game code, original 5E files, rewards, unlocks, campaign history or audio permissions. Return the review package for a separate implementation decision. Nothing is imported automatically.

Suggested history structure (a template only, not a completed review):

`Version: [version]; date: [actual date]; reviewer: [actual human]; reviewed text: [full text]; proposed text: [full text, if changed]; reason: [reason]; criterion decisions: [decisions]; final decision: [allowed status].`

## Meaning safeguards

- Keep all named `{placeholders}` unchanged. Check the slot's allowed values, number/plural forms and list grammar; never invent a completion, reward amount, boss name or unlock to fill a slot.
- Treat missing information as unknown, not zero. A saved reward total is not necessarily a spendable balance. A viewed or skipped briefing is not a completed mission.
- Recaps require accepted completion records and cover only the supported local encounter/history. A Mission 100 record is not proof all 100 chapters were completed. Do not narrate missing chapters or a sequel.
- Detailed tactical guidance here is Mission 1 content. Do not expand it into new boss-specific advice, campaign coverage or automatic spoken triggers.
- Preserve boss-intro, active, defeated/readiness and collected-relic distinctions. Boss defeat can already call completion recording; the missing-record response must not become a universal rule that defeat never saves progress. Relic rewards/readiness are separate.
- Review terms including Warden, relic, patrol, wind-up/recovery, guard, briefing, campaign, replay and recap. Keep implementation-paused/unbuilt chapters distinct from the player's pause menu.
- Recording rights, actor identity, linguistic approval and functional integration are separate matters. No audio or movie performance is part of this worksheet, and language approval grants no recording rights.

## Coverage

- 1. Mission guidance: 3.
- 2. Combat tips: 3.
- 3. Objective explanations: 3.
- 4. Story and event explanations: 3.
- 5. Mission completion conversations: 3.
- 6. Player progress summaries: 12.
- 7. Tenth-mission retrospective briefings: 8.
- 8. Boss encounter guidance: 4.
- 9. Replay and previously completed missions: 3.
- 10. Missing-information fallback responses: 9.

## Returning the worksheet

Retain all 51 rows and all IDs. Do not delete rejected or pending entries, renumber rows or edit source columns. Preserve every correction version. Return the completed worksheet with actual reviewer details and unresolved questions. A separate review will check identity/version consistency, status completeness and factual meaning before any authorized text or voice work. No approval, recording or integration should be inferred from this preparation step.
