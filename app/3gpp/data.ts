export type Technology = "GSM / GERAN" | "UMTS / UTRA" | "LTE / EPC" | "NR / 5GC" | "Common";
export type Domain = "Radio" | "Architecture" | "Protocols" | "Core network" | "Security" | "OAM" | "Testing" | "Services";
export type RelationKind = "official-parent" | "official-child" | "shared-work-item" | "curated-feature" | "technology-successor" | "cross-reference";

export const releases = ["Phase 1", "Phase 2", "Rel-96", "Rel-98", "Rel-99", "Rel-5", "Rel-6", "Rel-8", "Rel-10", "Rel-13", "Rel-15", "Rel-16", "Rel-17", "Rel-18", "Rel-19", "Rel-20", "Rel-21"] as const;
export type Release = typeof releases[number];

export type Specification = {
  number: string; title: string; type: "TS" | "TR"; status: "Active" | "Withdrawn";
  summary: string; technologies: Technology[]; domains: Domain[]; releaseAvailability: Release[];
  responsibleGroups: string[]; workItems: string[]; officialUrl: string; portalId?: number;
};

export type Relationship = {
  from: string; to: string; kind: RelationKind; authority: "Official" | "Inferred";
  source: string; rationale?: string; reviewed: string;
};

export type Feature = {
  id: string; name: string; technology: Technology; domain: Domain; release: Release;
  summary: string; specifications: string[]; status: "Frozen" | "Open";
};

export type FeatureDetail = {
  description: string;
  diagram: {label:string; caption:string}[];
  topics: string[];
  parameters: {name:string; guidance:string}[];
};

const report = (number: string) => `https://www.3gpp.org/dynareport/${number.replace(".", "")}.htm`;
const spec = (number: string, title: string, technology: Technology, domains: Domain[], releaseAvailability: Release[], group: string, summary: string, type: "TS" | "TR" = "TS"): Specification => ({
  number, title, type, status: "Active", summary, technologies: [technology], domains, releaseAvailability,
  responsibleGroups: [group], workItems: [], officialUrl: report(number),
});

export const snapshot = {
  id: "wavekit-3gpp-prototype-2026-08-28",
  date: "2026-08-28",
  scope: "Representative local prototype",
  sources: ["3GPP specification catalogue", "3GPP release descriptions", "3GPP specification detail pages"],
  openReleases: ["Rel-20", "Rel-21"] as Release[],
};

export const specifications: Specification[] = [
  spec("05.05", "Radio transmission and reception", "GSM / GERAN", ["Radio"], ["Phase 1", "Phase 2"], "RAN4", "Foundation radio requirements for GSM mobile stations and base stations."),
  spec("45.005", "Radio transmission and reception", "GSM / GERAN", ["Radio"], ["Rel-96", "Rel-98", "Rel-99", "Rel-5", "Rel-6"], "RAN4", "GERAN radio transmission, reception and channel arrangements."),
  spec("44.018", "Radio Resource Control protocol", "GSM / GERAN", ["Protocols"], ["Rel-96", "Rel-98", "Rel-99", "Rel-5", "Rel-6"], "RAN2", "Radio-resource signalling for GSM, GPRS and EDGE."),
  spec("25.211", "Physical channels and mapping of transport channels", "UMTS / UTRA", ["Radio"], ["Rel-99", "Rel-5", "Rel-6"], "RAN1", "UTRA physical channels and transport-channel mapping."),
  spec("25.212", "Multiplexing and channel coding", "UMTS / UTRA", ["Radio"], ["Rel-99", "Rel-5", "Rel-6"], "RAN1", "UTRA coding, interleaving and transport-channel multiplexing."),
  spec("25.331", "Radio Resource Control protocol specification", "UMTS / UTRA", ["Protocols"], ["Rel-99", "Rel-5", "Rel-6"], "RAN2", "UTRA RRC states, messages and procedures."),
  spec("23.401", "GPRS enhancements for E-UTRAN access", "LTE / EPC", ["Architecture", "Core network"], ["Rel-8", "Rel-10", "Rel-13", "Rel-15"], "SA2", "EPC architecture and procedures for E-UTRAN access."),
  spec("36.101", "UE radio transmission and reception", "LTE / EPC", ["Radio"], ["Rel-8", "Rel-10", "Rel-13", "Rel-15"], "RAN4", "LTE user-equipment RF requirements."),
  spec("36.104", "Base Station radio transmission and reception", "LTE / EPC", ["Radio"], ["Rel-8", "Rel-10", "Rel-13", "Rel-15"], "RAN4", "LTE base-station RF requirements."),
  spec("36.211", "Physical channels and modulation", "LTE / EPC", ["Radio"], ["Rel-8", "Rel-10", "Rel-13", "Rel-15"], "RAN1", "LTE physical signals, channels and modulation."),
  spec("36.212", "Multiplexing and channel coding", "LTE / EPC", ["Radio"], ["Rel-8", "Rel-10", "Rel-13", "Rel-15"], "RAN1", "LTE coding and transport-channel multiplexing."),
  spec("36.213", "Physical layer procedures", "LTE / EPC", ["Radio"], ["Rel-8", "Rel-10", "Rel-13", "Rel-15"], "RAN1", "LTE control, scheduling, power control and HARQ procedures."),
  spec("36.300", "E-UTRA and E-UTRAN overall description", "LTE / EPC", ["Architecture"], ["Rel-8", "Rel-10", "Rel-13", "Rel-15"], "RAN2", "Overall E-UTRAN architecture, functions and protocol states."),
  spec("36.331", "Radio Resource Control protocol specification", "LTE / EPC", ["Protocols"], ["Rel-8", "Rel-10", "Rel-13", "Rel-15"], "RAN2", "LTE RRC messages, information elements and procedures."),
  spec("23.501", "System architecture for the 5G System", "NR / 5GC", ["Architecture", "Core network"], ["Rel-15", "Rel-16", "Rel-17", "Rel-18", "Rel-19", "Rel-20", "Rel-21"], "SA2", "Architecture, functions and reference points for 5GS."),
  spec("23.502", "Procedures for the 5G System", "NR / 5GC", ["Architecture", "Core network"], ["Rel-15", "Rel-16", "Rel-17", "Rel-18", "Rel-19", "Rel-20", "Rel-21"], "SA2", "Stage-2 procedures and call flows for 5GS."),
  spec("33.501", "Security architecture and procedures for 5G System", "NR / 5GC", ["Security"], ["Rel-15", "Rel-16", "Rel-17", "Rel-18", "Rel-19"], "SA3", "5G security architecture, authentication and key management."),
  spec("38.101-1", "UE radio transmission and reception; Range 1 standalone", "NR / 5GC", ["Radio"], ["Rel-15", "Rel-16", "Rel-17", "Rel-18", "Rel-19"], "RAN4", "FR1 NR UE radio requirements."),
  spec("38.104", "Base Station radio transmission and reception", "NR / 5GC", ["Radio"], ["Rel-15", "Rel-16", "Rel-17", "Rel-18", "Rel-19"], "RAN4", "NR base-station RF requirements."),
  spec("38.211", "Physical channels and modulation", "NR / 5GC", ["Radio"], ["Rel-15", "Rel-16", "Rel-17", "Rel-18", "Rel-19", "Rel-20"], "RAN1", "NR physical resources, signals, channels and modulation."),
  spec("38.212", "Multiplexing and channel coding", "NR / 5GC", ["Radio"], ["Rel-15", "Rel-16", "Rel-17", "Rel-18", "Rel-19", "Rel-20"], "RAN1", "NR transport-channel coding and multiplexing."),
  spec("38.213", "Physical layer procedures for control", "NR / 5GC", ["Radio"], ["Rel-15", "Rel-16", "Rel-17", "Rel-18", "Rel-19", "Rel-20"], "RAN1", "NR control procedures including PDCCH and uplink control."),
  spec("38.214", "Physical layer procedures for data", "NR / 5GC", ["Radio"], ["Rel-15", "Rel-16", "Rel-17", "Rel-18", "Rel-19", "Rel-20"], "RAN1", "NR data scheduling, MIMO, link adaptation and HARQ."),
  spec("38.215", "Physical layer measurements", "NR / 5GC", ["Radio"], ["Rel-15", "Rel-16", "Rel-17", "Rel-18", "Rel-19"], "RAN1", "NR UE and network physical-layer measurements."),
  spec("38.300", "NR and NG-RAN overall description", "NR / 5GC", ["Architecture"], ["Rel-15", "Rel-16", "Rel-17", "Rel-18", "Rel-19", "Rel-20"], "RAN2", "Overall NR and NG-RAN architecture and functions."),
  spec("38.331", "Radio Resource Control protocol specification", "NR / 5GC", ["Protocols"], ["Rel-15", "Rel-16", "Rel-17", "Rel-18", "Rel-19", "Rel-20"], "RAN2", "NR RRC messages, states, information elements and procedures."),
  spec("38.901", "Study on channel model for frequencies from 0.5 to 100 GHz", "NR / 5GC", ["Radio"], ["Rel-15", "Rel-16", "Rel-17"], "RAN1", "Propagation and spatial channel models used for NR evaluations.", "TR"),
];

export const features: Feature[] = [
  {id:"gsm-foundation",name:"GSM foundation",technology:"GSM / GERAN",domain:"Radio",release:"Phase 2",summary:"Circuit-switched digital cellular radio and its air interface.",specifications:["05.05"],status:"Frozen"},
  {id:"gprs-edge",name:"GPRS and EDGE",technology:"GSM / GERAN",domain:"Radio",release:"Rel-98",summary:"Packet data and higher-rate modulation on GERAN.",specifications:["45.005","44.018"],status:"Frozen"},
  {id:"wcdma",name:"WCDMA / UTRA",technology:"UMTS / UTRA",domain:"Radio",release:"Rel-99",summary:"Wideband CDMA physical layer and radio control.",specifications:["25.211","25.212","25.331"],status:"Frozen"},
  {id:"hspa",name:"HSDPA and HSUPA",technology:"UMTS / UTRA",domain:"Radio",release:"Rel-6",summary:"High-speed downlink and uplink packet access enhancements.",specifications:["25.211","25.212","25.331"],status:"Frozen"},
  {id:"lte-foundation",name:"E-UTRA and EPC",technology:"LTE / EPC",domain:"Architecture",release:"Rel-8",summary:"OFDMA radio access with an all-IP evolved packet core.",specifications:["36.300","36.211","36.212","36.213","36.331","23.401"],status:"Frozen"},
  {id:"lte-ca",name:"Carrier aggregation",technology:"LTE / EPC",domain:"Radio",release:"Rel-10",summary:"Multiple component carriers combined for wider effective bandwidth.",specifications:["36.211","36.213","36.331"],status:"Frozen"},
  {id:"lte-iot",name:"LTE-M and NB-IoT",technology:"LTE / EPC",domain:"Radio",release:"Rel-13",summary:"Low-power wide-area cellular access for machine-type communication.",specifications:["36.211","36.213","36.331"],status:"Frozen"},
  {id:"nr-foundation",name:"Initial NR, NSA and SA",technology:"NR / 5GC",domain:"Architecture",release:"Rel-15",summary:"Flexible NR numerology, NG-RAN and the initial 5G System.",specifications:["38.211","38.212","38.213","38.214","38.300","38.331","23.501","23.502"],status:"Frozen"},
  {id:"nr-urllc",name:"URLLC, V2X and industrial enhancements",technology:"NR / 5GC",domain:"Radio",release:"Rel-16",summary:"Reliability, latency, sidelink and industrial communication improvements.",specifications:["38.211","38.213","38.214","38.331"],status:"Frozen"},
  {id:"nr-17",name:"NTN, RedCap, MBS and sidelink evolution",technology:"NR / 5GC",domain:"Radio",release:"Rel-17",summary:"Expanded coverage and device classes plus multicast and sidelink evolution.",specifications:["38.211","38.213","38.214","38.331"],status:"Frozen"},
  {id:"nr-advanced",name:"5G-Advanced",technology:"NR / 5GC",domain:"Radio",release:"Rel-18",summary:"First 5G-Advanced release with radio, system and automation enhancements.",specifications:["38.211","38.214","38.331","23.501"],status:"Frozen"},
  {id:"nr-21",name:"Release 21 studies and work",technology:"NR / 5GC",domain:"Architecture",release:"Rel-21",summary:"Open-release placeholder; scope and metadata can change after this snapshot.",specifications:["23.501","23.502"],status:"Open"},
];

export const featureDetails: Record<string,FeatureDetail> = {
  "gsm-foundation": {description:"GSM establishes a narrowband TDMA radio interface in which each RF carrier is divided into repeating time slots. Voice and signalling are mapped onto logical channels carried by those physical resources.",diagram:[{label:"MS",caption:"Mobile station"},{label:"TDMA carrier",caption:"Burst and time-slot mapping"},{label:"BTS / BSC",caption:"Radio access control"}],topics:["FDMA/TDMA radio access","GMSK modulation","Logical and physical channels","Power control and timing advance","Cell selection and handover"],parameters:[{name:"Carrier spacing",guidance:"200 kHz raster"},{name:"TDMA structure",guidance:"8 time slots per carrier frame"},{name:"Core radio measurements",guidance:"RxLev, RxQual and timing advance"}]},
  "gprs-edge": {description:"GPRS adds packet-data channels to the GSM carrier structure. EDGE increases the achievable data rate by adding higher-order modulation and modulation-dependent coding schemes while retaining the GERAN frame framework.",diagram:[{label:"Packet data",caption:"Application traffic"},{label:"PDCH / MCS",caption:"Slot allocation and coding"},{label:"GERAN",caption:"Packet radio access"}],topics:["Packet data channels","Temporary block flows","Coding and modulation schemes","Multislot operation","Link adaptation and retransmission"],parameters:[{name:"Radio channel",guidance:"200 kHz GSM carrier"},{name:"Modulation",guidance:"GMSK; 8PSK for EDGE"},{name:"Capacity driver",guidance:"Allocated slots, coding scheme and radio quality"}]},
  "wcdma": {description:"UTRA spreads simultaneous transmissions across a wide carrier using code-domain separation. Fast power control and radio-resource control manage interference, mobility and the mapping from transport channels to physical channels.",diagram:[{label:"UE data",caption:"Transport channels"},{label:"Spreading",caption:"Codes and scrambling"},{label:"Node B / RNC",caption:"Interference-managed access"}],topics:["Spreading and scrambling codes","Transport-channel mapping","Fast power control","Soft and softer handover","RRC states and measurements"],parameters:[{name:"Nominal carrier bandwidth",guidance:"5 MHz"},{name:"Chip rate",guidance:"3.84 Mcps"},{name:"Planning focus",guidance:"Ec/No, RSCP, load and interference"}]},
  "hspa": {description:"HSPA evolves WCDMA packet access with shared channels, rapid scheduling, adaptive modulation and coding, and fast retransmissions. HSDPA enhances downlink delivery; HSUPA enhances the uplink.",diagram:[{label:"Channel state",caption:"UE/network feedback"},{label:"Fast scheduler",caption:"MCS and resource choice"},{label:"HARQ",caption:"Rapid packet delivery"}],topics:["HS-DSCH and E-DCH","Node B scheduling","Adaptive modulation and coding","Hybrid ARQ","Category and capability signalling"],parameters:[{name:"Scheduling interval",guidance:"Short radio intervals; verify per feature"},{name:"Rate drivers",guidance:"Codes, MCS, category and radio conditions"},{name:"Direction",guidance:"HSDPA downlink; HSUPA uplink"}]},
  "lte-foundation": {description:"LTE combines an OFDMA downlink, SC-FDMA uplink and flat E-UTRAN architecture with the Evolved Packet Core. Scheduling occurs in time-frequency resource blocks and RRC controls connectivity and mobility.",diagram:[{label:"UE",caption:"IP service and radio bearer"},{label:"E-UTRAN",caption:"OFDM resource scheduling"},{label:"EPC",caption:"Mobility and packet core"}],topics:["OFDMA and SC-FDMA","Resource blocks and subframes","EPS bearers and QoS","RRC states and mobility","E-UTRAN/EPC interfaces"],parameters:[{name:"Channel bandwidth",guidance:"1.4, 3, 5, 10, 15 or 20 MHz"},{name:"Baseline subcarrier spacing",guidance:"15 kHz"},{name:"Duplex modes",guidance:"FDD and TDD"}]},
  "lte-ca": {description:"Carrier aggregation combines multiple LTE component carriers so a capable UE can transmit or receive across a wider effective bandwidth. The carriers can be contiguous, non-contiguous or in different bands.",diagram:[{label:"CC 1",caption:"Primary component carrier"},{label:"Aggregation",caption:"Cross-carrier scheduling"},{label:"CC n",caption:"Secondary component carriers"}],topics:["Primary and secondary cells","Intra-band and inter-band combinations","Contiguous and non-contiguous CA","Cross-carrier scheduling","UE band-combination capability"],parameters:[{name:"Component carrier",guidance:"LTE carrier up to 20 MHz"},{name:"Aggregate bandwidth",guidance:"Depends on release, UE and approved band combination"},{name:"Engineering checks",guidance:"Band combination, MIMO layers, power and backhaul"}]},
  "lte-iot": {description:"LTE-M and NB-IoT tailor LTE access for lower-complexity devices, extended coverage and power-efficient operation. Their bandwidth, capability and deployment options differ and must be treated separately.",diagram:[{label:"IoT device",caption:"Low complexity and power"},{label:"LTE-M / NB-IoT",caption:"Narrow resource allocation"},{label:"IoT service",caption:"Coverage and battery life"}],topics:["Category M1 and NB-IoT UE classes","Coverage enhancement repetitions","Power saving mode and eDRX","Small-data transmission","In-band, guard-band and standalone deployment"],parameters:[{name:"LTE-M bandwidth",guidance:"Nominal 1.4 MHz operation"},{name:"NB-IoT bandwidth",guidance:"One 180 kHz resource-block scale"},{name:"Trade-off",guidance:"Coverage and battery life versus throughput and latency"}]},
  "nr-foundation": {description:"Initial NR introduces scalable numerology, flexible slot structures, beam-centric operation and NG-RAN connectivity. It supports non-standalone operation anchored by LTE and standalone operation with 5GC.",diagram:[{label:"UE / beam",caption:"Flexible radio access"},{label:"gNB",caption:"NR scheduling and mobility"},{label:"EPC or 5GC",caption:"NSA anchor or SA core"}],topics:["FR1 and FR2 operation","Scalable numerology","Bandwidth parts","Beam management","NSA and SA architecture","PDCCH, PDSCH, PUCCH and PUSCH"],parameters:[{name:"Subcarrier spacing",guidance:"15 × 2^μ kHz; applicable values depend on band and channel"},{name:"Resource block",guidance:"12 subcarriers"},{name:"Duplex and frame use",guidance:"FDD, TDD and flexible symbol configuration"}]},
  "nr-urllc": {description:"Release 16 enhances NR for time-sensitive and highly reliable communication, industrial use and sidelink-based V2X. The mechanisms reduce scheduling delay and improve transmission robustness, subject to deployment design.",diagram:[{label:"Critical packet",caption:"Latency and reliability target"},{label:"Priority resources",caption:"Configured grant, repetition, pre-emption"},{label:"Delivery",caption:"Network or sidelink path"}],topics:["Configured-grant uplink","Mini-slot and repetition mechanisms","Priority and pre-emption","NR sidelink for V2X","Industrial timing and private-network use"],parameters:[{name:"Design objectives",guidance:"Latency, reliability and availability are service-specific"},{name:"Scheduling",guidance:"Configured or dynamic grants"},{name:"Evaluation inputs",guidance:"Packet size, periodicity, BLER target and channel condition"}]},
  "nr-17": {description:"Release 17 broadens NR with reduced-capability devices, non-terrestrial access, multicast/broadcast and enhanced sidelink. These are distinct feature families that share the NR protocol foundation.",diagram:[{label:"New reach",caption:"Satellite and reduced capability"},{label:"NR evolution",caption:"Protocol and radio enhancements"},{label:"New services",caption:"MBS and sidelink"}],topics:["NR NTN and IoT NTN","Reduced Capability (RedCap)","NR multicast and broadcast services","Sidelink evolution","Coverage and mobility enhancements"],parameters:[{name:"NTN considerations",guidance:"Propagation delay, Doppler, ephemeris and timing"},{name:"RedCap considerations",guidance:"Reduced bandwidth, antennas and UE complexity"},{name:"MBS considerations",guidance:"Service area, unicast/multicast delivery and mobility"}]},
  "nr-advanced": {description:"Release 18 begins 5G-Advanced, enhancing established NR capabilities and introducing new work in energy efficiency, AI/ML and immersive services. Individual functions span multiple RAN, SA and CT specifications.",diagram:[{label:"Rel-17 baseline",caption:"Established NR capabilities"},{label:"Rel-18 enhancement",caption:"Radio and system intelligence"},{label:"5G-Advanced",caption:"Efficiency and new use cases"}],topics:["MIMO and mobility enhancements","AI/ML for the air interface","Network energy saving","XR and immersive communication","NTN and RedCap evolution","Positioning and sidelink evolution"],parameters:[{name:"Performance dimensions",guidance:"Capacity, coverage, latency, energy and positioning"},{name:"AI/ML scope",guidance:"Feature-specific models, data and lifecycle procedures"},{name:"Applicability",guidance:"Verify work item, band, UE capability and specification version"}]},
  "nr-21": {description:"Release 21 is represented as an open planning node in this snapshot. Content, work-item allocation and specification impacts can change, so this page intentionally avoids presenting proposed values as stable requirements.",diagram:[{label:"Study",caption:"Use cases and feasibility"},{label:"Work item",caption:"Agreed normative scope"},{label:"Specification",caption:"Change-controlled text"}],topics:["Release planning","Study-item progression","Work-item approval","Normative specification impact","Potential 6G study relationship"],parameters:[{name:"Release status",guidance:"Open in this WaveKit snapshot"},{name:"Snapshot rule",guidance:"Do not treat candidate scope as frozen"},{name:"Review action",guidance:"Recheck official work plan and portal metadata"}]},
};

export const relationships: Relationship[] = [
  {from:"05.05",to:"45.005",kind:"technology-successor",authority:"Inferred",source:"WaveKit editorial mapping",rationale:"The 45-series continues GSM/GERAN radio requirements in later release numbering.",reviewed:snapshot.date},
  {from:"25.211",to:"36.211",kind:"technology-successor",authority:"Inferred",source:"WaveKit technology lineage",rationale:"Physical-channel foundation across successive 3GPP radio generations.",reviewed:snapshot.date},
  {from:"36.211",to:"38.211",kind:"technology-successor",authority:"Inferred",source:"WaveKit technology lineage",rationale:"LTE and NR physical-channel specifications occupy analogous roles.",reviewed:snapshot.date},
  {from:"38.211",to:"38.212",kind:"cross-reference",authority:"Inferred",source:"WaveKit RAN foundation grouping",rationale:"Modulation and coding are jointly needed to interpret the NR physical layer.",reviewed:snapshot.date},
  {from:"38.212",to:"38.213",kind:"cross-reference",authority:"Inferred",source:"WaveKit RAN foundation grouping",rationale:"Coding outputs are used by NR physical-layer control procedures.",reviewed:snapshot.date},
  {from:"38.213",to:"38.214",kind:"cross-reference",authority:"Inferred",source:"WaveKit RAN foundation grouping",rationale:"Control and data procedures form a coordinated physical-layer set.",reviewed:snapshot.date},
  {from:"38.300",to:"38.331",kind:"official-child",authority:"Official",source:"3GPP specification catalogue hierarchy",reviewed:snapshot.date},
  {from:"23.501",to:"23.502",kind:"cross-reference",authority:"Official",source:"3GPP specification titles and catalogue links",reviewed:snapshot.date},
];

export const technologies: Technology[] = ["GSM / GERAN", "UMTS / UTRA", "LTE / EPC", "NR / 5GC", "Common"];
export const domains: Domain[] = ["Radio", "Architecture", "Protocols", "Core network", "Security", "OAM", "Testing", "Services"];

export function getSpecification(number: string) { return specifications.find(item => item.number === decodeURIComponent(number)); }

export function validateSnapshot() {
  const errors: string[] = [];
  const numbers = new Set<string>();
  for (const item of specifications) {
    if (numbers.has(item.number)) errors.push(`Duplicate specification ${item.number}`);
    numbers.add(item.number);
    if (!item.officialUrl.startsWith("https://www.3gpp.org/")) errors.push(`Non-3GPP URL for ${item.number}`);
    if (!item.releaseAvailability.length || !item.responsibleGroups.length) errors.push(`Incomplete metadata for ${item.number}`);
  }
  for (const edge of relationships) {
    if (!numbers.has(edge.from) || !numbers.has(edge.to)) errors.push(`Missing relation target ${edge.from} → ${edge.to}`);
    if (edge.authority === "Inferred" && (!edge.rationale || !edge.reviewed)) errors.push(`Unreviewed inferred relation ${edge.from} → ${edge.to}`);
  }
  for (const feature of features) for (const number of feature.specifications) if (!numbers.has(number)) errors.push(`Missing feature target ${number}`);
  for (const feature of features) if (!featureDetails[feature.id] || featureDetails[feature.id].diagram.length<3 || !featureDetails[feature.id].topics.length || !featureDetails[feature.id].parameters.length) errors.push(`Incomplete feature detail ${feature.id}`);
  if (errors.length) throw new Error(`Invalid 3GPP snapshot: ${errors.join("; ")}`);
  return true;
}
