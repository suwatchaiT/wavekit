# WaveKit technical review record

Review date: 28 August 2026  
Technical owner: WaveKit maintainer (`suwatchaiT`)  
Review level: maintainer formula review; this is not independent SME approval.

## Highest-risk tools reviewed

### Channel ↔ Frequency

- Confirmed the LTE forward and reverse equations use the 100 kHz raster: `F = Flow + 0.1 × (N − Noffs)`.
- Confirmed the NR global raster changes at 3,000 MHz and 24,250.08 MHz.
- Remaining gate: independently validate every represented GSM/LTE band-table boundary.

### Free-Space Path Loss and propagation models

- Confirmed the free-space implementation uses `32.44 + 20 log10(fMHz) + 20 log10(dkm)`, consistent with ITU-R P.525-5 equation 6 within rounding.
- Confirmed 3GPP UMa/UMi paths select the maximum of LOS and NLOS where the planning implementation applies NLOS.
- Remaining gate: the simplified breakpoint/effective-height treatment must not be described as site-specific prediction.

### Link Budget

- Confirmed occupied bandwidth is `PRB × 12 × SCS`, thermal noise is derived from `−174 dBm/Hz`, and gains/losses follow consistent signs through MAPL.
- Confirmed shadow margin uses a normal quantile multiplied by entered sigma.
- Remaining gate: presets and required SINR are planning defaults, not equipment compliance values; independent RF-planning SME approval remains required.

### Maximum Cellular Speed

- Confirmed standardized LTE and NR PRB tables drive the resource count and FDD/TDD time allocation is explicit.
- The result is intentionally a planning estimate. It does not implement 3GPP transport-block-size/MCS tables or coding-rate limits.
- Remaining gate: use a dedicated MCS/TBS implementation before describing results as standards-conformant peak throughput.

### LTE and NR Resource Grids

- Confirmed resource-element dimensions, LTE 15 kHz PRB structure, NR 14-symbol normal-CP slot structure and NR PRB lookup basis.
- Grid signal placement is an explanatory visualization; it is not a complete scheduler or standards-conformance renderer.

## Primary references

- ITU-R P.525-5 (11/2024), Calculation of free-space attenuation.
- 3GPP TS 36.101, §5.7.3, LTE carrier frequency and EARFCN.
- 3GPP TS 38.104, §5.3.2, NR transmission bandwidth configuration.
- 3GPP TR 38.901, path-loss models for 0.5–100 GHz.
- 3GPP TS 36.211 and TS 38.211, physical channels and modulation.
