import assert from "node:assert/strict";
import {
  addUtcDays,
  buildMandiLogicalKey,
  formatAgmarknetDate,
  formatIsoDate,
  parseAgmarknetDate,
  parseIsoDate,
} from "../lib/mandiArchive";

const base = {
  sourceDateIso: "2026-06-23",
  state: "Madhya Pradesh",
  district: "Indore",
  mandi: "Indore",
  crop: "Wheat",
  variety: "Lokwan",
  grade: "FAQ",
};

const firstKey = buildMandiLogicalKey(base);
const rerunKey = buildMandiLogicalKey({
  ...base,
  state: "  madhya   pradesh ",
  crop: "wHEAT",
});

assert.equal(firstKey, rerunKey, "same logical row must keep the same key on rerun");
assert.notEqual(
  firstKey,
  buildMandiLogicalKey({ ...base, variety: "Sharbati" }),
  "variety must participate in the logical key"
);
assert.notEqual(
  firstKey,
  buildMandiLogicalKey({ ...base, grade: "A" }),
  "grade must participate in the logical key"
);
assert.notEqual(
  firstKey,
  buildMandiLogicalKey({ ...base, sourceDateIso: "2026-06-24" }),
  "source date must participate in the logical key"
);

const parsed = parseIsoDate("2026-06-23");
assert.ok(parsed);
assert.equal(formatIsoDate(parsed), "2026-06-23");
assert.equal(formatAgmarknetDate(parsed), "23/06/2026");
assert.equal(formatIsoDate(parseAgmarknetDate("23/06/2026")!), "2026-06-23");
assert.equal(formatIsoDate(addUtcDays(parsed, 1)), "2026-06-24");
assert.equal(parseIsoDate("2026-02-30"), null, "invalid dates must be rejected");
assert.equal(parseAgmarknetDate("30/02/2026"), null, "invalid source dates must be rejected");

console.log("mandi archive checks passed");

