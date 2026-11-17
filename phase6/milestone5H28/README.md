# 5H.28 isolated gap-assessment evidence

Experimental game copy: staging/. Accepted baseline remains ../milestone5H24/staging/ unchanged.

server.mjs exports stagingServer(), used by the test harnesses. It serves only loopback, its own root/cache and existing read-only assets. It does not read project .env.

playthrough.mjs: ordinary-input Mission1 attempt, new profile; ended in defeat. Preserve raw-results.json and screenshots.
mission2.mjs: disposable earned-history fixture, UI launch/movement/combat/pause/exit compatibility only.
victory-fixture.mjs: explicitly injected boss/relic/completed-ending presentation state plus prior earned history. Not natural completion or cinematic validation.
event-policy.test.mjs: six pure eligibility/deduplication contract tests.

No generated/copy-packaged audio, no production integration, no commercial approval. All test processes stopped. No restore is required: preserve this directory and use the unchanged accepted baseline. Do not overwrite earlier reports or rerun scripts over existing output evidence without a new output location.
