# Contributing to WaveKit

Thank you for helping improve WaveKit.

## Before opening a change

Open an issue describing the problem, affected tool and intended result. For a technical formula or standards-table change, identify the authoritative source and relevant section.

## Development workflow

1. Fork or branch from the latest default branch.
2. Install dependencies with `npm install`.
3. Make a focused change.
4. Add or update verification cases.
5. Run `npm run lint` and `npm test`.
6. Open a pull request explaining the calculation, assumptions and limitations.

## Technical contribution requirements

A new or changed engineering tool should include:

- Model or standard name and represented version
- Applicable frequency or input range
- Units and conversions
- Assumptions and known exclusions
- Standards-based or planning-estimate status
- Last technical review date
- At least one independently calculated reference case
- User-facing formula and explanation
- Reference-only disclaimer

Avoid copying restricted standards text. Cite the authoritative publication and express explanations in original wording.

## Pull-request scope

Keep unrelated formatting and refactoring out of technical calculation changes. Never commit credentials, customer data, production network details or confidential documents.
