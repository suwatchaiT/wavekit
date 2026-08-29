import type {Release,Technology} from "./data";

export type Tool3gppRelation={technologies:Technology[];features:string[];specifications:string[];releases:Release[]};

export const tool3gppRelations:Record<string,Tool3gppRelation>={
  "channel-frequency":{technologies:["GSM / GERAN","LTE / EPC","NR / 5GC"],features:["gsm-foundation","gprs-edge","lte-foundation","nr-foundation"],specifications:["45.005","36.101","38.104"],releases:["Rel-98","Rel-8","Rel-15"]},
  "resource-blocks":{technologies:["LTE / EPC","NR / 5GC"],features:["lte-foundation","lte-ca","lte-iot","nr-foundation"],specifications:["36.211","38.104","38.211"],releases:["Rel-8","Rel-10","Rel-13","Rel-15"]},
  "lte-resource-grid":{technologies:["LTE / EPC"],features:["lte-foundation","lte-ca","lte-iot"],specifications:["36.211","36.213"],releases:["Rel-8","Rel-10","Rel-13"]},
  "nr-resource-grid":{technologies:["NR / 5GC"],features:["nr-foundation","nr-urllc","nr-17","nr-advanced"],specifications:["38.211","38.213","38.214"],releases:["Rel-15","Rel-16","Rel-17","Rel-18"]},
  "maximum-cellular-speed":{technologies:["LTE / EPC","NR / 5GC"],features:["lte-foundation","lte-ca","nr-foundation","nr-advanced"],specifications:["36.211","36.213","38.211","38.214"],releases:["Rel-8","Rel-10","Rel-15","Rel-18"]},
  "free-space-path-loss":{technologies:["NR / 5GC"],features:["nr-foundation","nr-17"],specifications:["38.901"],releases:["Rel-15","Rel-17"]},
  "link-budget":{technologies:["LTE / EPC","NR / 5GC"],features:["lte-foundation","lte-iot","nr-foundation","nr-17"],specifications:["36.101","38.101-1","38.104"],releases:["Rel-8","Rel-13","Rel-15","Rel-17"]},
  "array-beamforming":{technologies:["NR / 5GC"],features:["nr-foundation","nr-advanced"],specifications:["38.214","38.901"],releases:["Rel-15","Rel-18"]},
  "mimo-spacing":{technologies:["LTE / EPC","NR / 5GC"],features:["lte-foundation","nr-foundation","nr-advanced"],specifications:["36.211","38.214","38.901"],releases:["Rel-8","Rel-15","Rel-18"]},
};

export function toolsForFeature(featureId:string){return Object.entries(tool3gppRelations).filter(([,relation])=>relation.features.includes(featureId)).map(([slug])=>slug)}
