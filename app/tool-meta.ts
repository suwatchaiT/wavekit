export type ToolStatus = "Standards-based" | "Planning estimate";
export type ToolMeta = { standard:string; version:string; range:string; assumptions:string; reviewed:string; status:ToolStatus };

const reviewed="27 August 2026";
const categoryDefaults:Record<string,ToolMeta>={
  "RF Planning":{standard:"ITU-R propagation and radio-link engineering methods",version:"Current linked recommendations; simplified browser implementation",range:"Use only within the limits stated by the selected model and input fields.",assumptions:"Nominal equipment values, consistent units and a stationary radio path unless the tool says otherwise.",reviewed,status:"Planning estimate"},
  Cellular:{standard:"3GPP radio-access specifications",version:"Referenced 3GPP releases and band tables shown on the tool",range:"GSM, LTE and NR ranges supported by the displayed band/raster tables.",assumptions:"Nominal physical-layer configuration; implementation and regional band support may differ.",reviewed,status:"Standards-based"},
  Antenna:{standard:"Classical antenna theory and referenced ITU-R/IEEE methods",version:"Analytical planning model",range:"Far-field, narrowband or free-space conditions unless explicitly stated otherwise.",assumptions:"Ideal geometry and nominal antenna data; mounting, coupling, clutter and manufacturing tolerances are excluded.",reviewed,status:"Planning estimate"},
  "Wi-Fi":{standard:"IEEE 802.11 channelization and PHY concepts",version:"802.11 through 802.11be where applicable",range:"2.4 GHz, 5 GHz and 6 GHz values exposed by the tool.",assumptions:"Regulatory availability, permitted power and channel width must be verified for the deployment country.",reviewed,status:"Standards-based"},
  "IP Calculator":{standard:"IETF RFC addressing and subnetting conventions",version:"IPv4/IPv6 standards referenced on the tool",range:"IPv4 0.0.0.0–255.255.255.255 or IPv6 /0–/128 as applicable.",assumptions:"Canonical CIDR arithmetic; routing policy, firewall behavior and platform-specific reservations are excluded.",reviewed,status:"Standards-based"},
};

const overrides:Record<string,Partial<ToolMeta>>={
  "channel-frequency":{standard:"3GPP TS 45.005, TS 36.101 and TS 38.104",version:"Band/raster tables represented in this WaveKit build",range:"Supported GSM ARFCN, LTE EARFCN and NR-ARFCN ranges shown after selecting a technology and direction.",assumptions:"The selected channel belongs to the selected band; regional licensing and equipment support are not inferred."},
  "resource-blocks":{standard:"3GPP TS 36.211 and TS 38.104",range:"LTE 1.4–20 MHz; NR combinations available in the selected SCS/bandwidth table."},
  "lte-resource-grid":{standard:"3GPP TS 36.211",version:"LTE downlink/uplink resource-grid planning view",range:"LTE bandwidths 1.4–20 MHz and displayed FDD/TDD configurations."},
  "nr-resource-grid":{standard:"3GPP TS 38.211 and TS 38.213",version:"NR resource-grid planning view",range:"Displayed FR1/FR2 numerologies, bandwidths and TDD patterns."},
  "maximum-cellular-speed":{standard:"3GPP LTE/NR physical-layer parameters",status:"Planning estimate",range:"LTE FDD/TDD and NR configurations exposed in the calculator.",assumptions:"Theoretical peak rate before scheduler, protocol, retransmission, RF and core-network losses."},
  "free-space-path-loss":{standard:"ITU-R P.525",range:"Free-space line-of-sight paths at any positive frequency and distance entered.",assumptions:"Unobstructed isotropic propagation; excludes clutter, diffraction, reflection, weather and feeder losses."},
  "link-budget":{standard:"ITU-R P.341 with referenced 3GPP transmitter/receiver parameters",range:"LTE and NR configurations exposed by the calculator.",assumptions:"Median deterministic budget; site-specific fading, interference and implementation margins require engineering review."},
  "fresnel-zone":{standard:"First Fresnel-zone geometry",range:"Any positive MHz frequency and positive d1/d2 path distances.",assumptions:"Straight line of sight and smooth-earth geometry; terrain and Earth curvature are not automatically profiled."},
  "thermal-noise":{standard:"Johnson–Nyquist thermal noise",range:"Positive bandwidth and physically meaningful temperature/noise-figure inputs."},
  "eirp":{standard:"Logarithmic RF power accounting",range:"Any internally consistent dBm, dB and dBi values.",assumptions:"Single transmit path; mismatch, antenna-pattern direction and regulatory averaging are excluded."},
  "cidr-tools":{standard:"IETF CIDR prefix arithmetic",range:"One valid IPv4 parent network, /0 through /32.",assumptions:"The entered address is normalized to its parent network before aligned child prefixes are generated."},
};

export function getToolMeta(slug:string,category:string):ToolMeta{return {...categoryDefaults[category],...overrides[slug]}}
