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
