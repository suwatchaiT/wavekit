import assert from "node:assert/strict";
import test from "node:test";

async function render(path="/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`,{headers:{accept:"text/html"}}),{ASSETS:{fetch:async()=>new Response("Not found",{status:404})}},{waitUntil(){},passThroughOnException(){}});
}

test("renders the WaveKit catalog with the live tool count",async()=>{const response=await render();assert.equal(response.status,200);const html=await response.text();assert.match(html,/Wave<span>Kit/);assert.match(html,/>35<\/b><span>Engineering tools/);assert.match(html,/Search all/);assert.doesNotMatch(html,/QUICK CALCULATOR/);assert.match(html,/BETA 0\.1/)});

test("renders a tool with controls, technical scope and disclaimer",async()=>{const response=await render("/tools/free-space-path-loss");assert.equal(response.status,200);const html=await response.text();assert.match(html,/Free-Space Path Loss/);assert.match(html,/Copy share link/);assert.match(html,/TECHNICAL BASIS/);assert.match(html,/ITU-R P\.525/);assert.match(html,/Reference-only disclaimer/)});

test("renders public information pages",async()=>{for(const slug of ["about","methodology","readiness","privacy","disclaimer"]){const response=await render(`/info/${slug}`);assert.equal(response.status,200);const html=await response.text();assert.match(html,/WaveKit/);assert.match(html,/BETA 0\.1/)}});

test("publishes ownership and honest review status",async()=>{const response=await render("/tools/link-budget");const html=await response.text();assert.match(html,/Technical owner/);assert.match(html,/suwatchaiT/);assert.match(html,/independent RF-planning SME approval pending/);assert.match(html,/Report a problem on GitHub/)});

test("CIDR tool exposes splitting only",async()=>{const response=await render("/tools/cidr-tools");assert.equal(response.status,200);const html=await response.text();assert.match(html,/CIDR Split Calculator/);assert.doesNotMatch(html,/CIDR Aggregate|Split \/ aggregate|Choose split or aggregate/) });

test("renders the dated 3GPP technology and feature map",async()=>{const response=await render("/3gpp");assert.equal(response.status,200);const html=await response.text();assert.match(html,/3GPP KNOWLEDGE MAP/);assert.match(html,/GSM \/ GERAN/);assert.match(html,/Initial NR, NSA and SA/);assert.match(html,/Rel-21/);assert.match(html,/Snapshot.*2026-08-28/s);assert.match(html,/Official.*Inferred/s)});

test("renders an interactive 3GPP keyword cloud",async()=>{const response=await render("/3gpp");assert.equal(response.status,200);const html=await response.text();assert.match(html,/KEYWORD SIGNAL MAP/);assert.match(html,/Interactive 3GPP keyword cloud/);assert.match(html,/Carrier aggregation/);assert.match(html,/aria-pressed="false"/)});

test("renders feature descriptions, infographics, topics and parameters",async()=>{const response=await render("/3gpp");assert.equal(response.status,200);const html=await response.text();assert.match(html,/Initial NR introduces scalable numerology/);assert.match(html,/Initial NR, NSA and SA operation overview/);assert.match(html,/Topics in this feature/);assert.match(html,/Key engineering parameters/);assert.match(html,/Subcarrier spacing/);assert.match(html,/Related specifications/)});

test("connects 3GPP features to related WaveKit calculators",async()=>{const response=await render("/3gpp");assert.equal(response.status,200);const html=await response.text();assert.match(html,/Related WaveKit tools/);assert.match(html,/href="\/tools\/nr-resource-grid"/);assert.match(html,/href="\/tools\/maximum-cellular-speed"/)});

test("connects cellular calculators to internal 3GPP references and features",async()=>{const response=await render("/tools/nr-resource-grid");assert.equal(response.status,200);const html=await response.text();assert.match(html,/href="\/3gpp\/spec\/38\.211"/);assert.match(html,/3GPP technology/);assert.match(html,/Mapped features/);assert.match(html,/Release coverage/);assert.match(html,/href="\/3gpp\?feature=nr-foundation"/);assert.match(html,/Explore the complete 3GPP knowledge map/)});

test("renders the searchable representative specification index",async()=>{const response=await render("/3gpp/specifications");assert.equal(response.status,200);const html=await response.text();assert.match(html,/3GPP specification index/);assert.match(html,/38\.211/);assert.match(html,/38\.901/);assert.match(html,/27.*sample records/s)});

test("renders specification provenance and official source links",async()=>{const response=await render("/3gpp/spec/38.211");assert.equal(response.status,200);const html=await response.text();assert.match(html,/Physical channels and modulation/);assert.match(html,/Open official 3GPP record/);assert.match(html,/RELATIONSHIP PROVENANCE/);assert.match(html,/Inferred/);assert.match(html,/Reference-only metadata/)});
