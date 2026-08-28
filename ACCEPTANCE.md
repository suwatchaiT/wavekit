# WaveKit Beta 0.1 acceptance record

Date: 28 August 2026  
Release owner: `suwatchaiT`

## Automated checks

- `npm run lint`: passed.
- `npm test`: passed, including a production build and five rendered-HTML tests.

## Browser acceptance

Tested in the Codex in-app Chromium browser against `http://localhost:3000`.

| View | Coverage | Result |
| --- | --- | --- |
| Desktop | Home catalog/count, tool search, Link Budget output and technical scope, shareable input URL, reset defaults, Maximum Cellular Speed, Readiness page | Passed |
| Mobile, 390 × 844 | Home, Link Budget, Channel ↔ Frequency, NR Resource Grid, Readiness page; document-width overflow check | Passed after fixing NR Resource Grid overflow |

Safari and Firefox were not available in this acceptance environment and remain follow-up compatibility checks. This record does not claim those browser families were tested.

## Rollback rehearsal

Source rollback passed. Release commit `ac956af` (the commit used for GitHub release `v0.1.0`) was checked out into an isolated detached worktree, then built and tested successfully. The temporary worktree was removed without changing `main`.

Hosted rollback remains pending until WaveKit has a live Cloudflare deployment with a prior deployment to restore. After deployment, rehearse rollback by redeploying the previous known-good build, smoke-testing the public URL, then redeploying the current release.

