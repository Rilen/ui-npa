import assert from "node:assert/strict";
import test from "node:test";
import { mountSidebar } from "../packages/styles/sidebar.js";

test("expõe o contrato comportamental da sidebar", () => {
  assert.equal(typeof mountSidebar, "function");
  assert.throws(() => mountSidebar(null), /sidebar/i);
  assert.throws(() => mountSidebar({ nodeType: 1 }, null), /opções/i);
});
