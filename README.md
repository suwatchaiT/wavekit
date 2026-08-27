# WaveKit

WaveKit is a browser-based engineering toolbox for GSM, LTE, NR, Wi-Fi, antenna, RF-planning and IP-network calculations.

WaveKit Beta 0.1 currently includes 35 focused tools. Calculations run locally in the browser, and calculator inputs can be preserved in shareable URLs.

## Important notice

WaveKit is reference software for education, planning estimates and independent cross-checks. It is not a calibrated instrument, certified design system, compliance certificate or operational guarantee.

Do not use its output as the sole basis for safety decisions, regulatory compliance, commissioning, contractual claims, purchasing or network changes. Verify material results against current standards, vendor documentation, calibrated tools and applicable local requirements.

## Tool categories

- RF Planning: propagation loss, link budgets, Fresnel clearance, thermal noise, EIRP and power conversion.
- Cellular: GSM/LTE/NR channel conversion, resource blocks, LTE/NR grids and peak-throughput estimates.
- Antenna: coverage geometry, patterns, beamforming, aperture, dish design, field boundaries, polarization, MIMO spacing, PIM and feeder loss.
- Wi-Fi: channel references and airtime estimates.
- IP Calculator: IPv4/IPv6 subnetting, VLSM, CIDR splitting, ranges, masks, address conversion, MTU/MSS, DHCP and overlap checks.

Each tool displays its technical basis, represented model or standard, applicable range, assumptions, review date and standards-based or planning-estimate status.

## Local development

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm test
```

`npm test` creates the production vinext build and runs server-rendering smoke tests.

## Architecture

- Next-compatible application structure under `app/`
- React calculator components with local browser state
- vinext and the Cloudflare Vite plugin
- Cloudflare Worker entry point under `worker/`
- No database, account or server-side calculation service in Beta 0.1

## Deployment

The current build targets Cloudflare Workers. Create the production build with:

```bash
npm run build
```

Use a Cloudflare preview or `workers.dev` hostname before attaching a production custom domain. See the official [Cloudflare Workers static-assets guide](https://developers.cloudflare.com/workers/static-assets/get-started/) and [custom-domain guide](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).

## Reporting problems

Open a GitHub issue and include:

- Tool name and shareable URL
- Actual result and expected result
- Standard, reference or independent calculation used for comparison
- Browser and operating system

Do not include confidential network, customer or location data.

Security concerns should follow [SECURITY.md](SECURITY.md).

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a calculator or formula change. Technical changes should include sources, assumptions, range limits and representative verification cases.

## License

WaveKit is available under the [MIT License](LICENSE). Standards documents and external references remain subject to their respective owners and licenses.
