import assert from "node:assert/strict";
import test from "node:test";
import pairs from "./contrast-pairs.json" with { type: "json" };
import { contrastRatio } from "./contrast.mjs";
import { buildTokens } from "../scripts/build-tokens.mjs";

const model = buildTokens();

for (const themeName of ["light", "dark"]) {
  for (const pair of pairs) {
    test(`${themeName}: ${pair.fg} sobre ${pair.bg} >= ${pair.min}`, () => {
      const theme = model[themeName];
      const foreground = theme[pair.fg]?.value;
      const background = theme[pair.bg]?.value;
      assert.ok(foreground, `token ausente: ${pair.fg}`);
      assert.ok(background, `token ausente: ${pair.bg}`);
      const ratio = contrastRatio(foreground, background);
      assert.ok(
        ratio >= pair.min,
        `${ratio.toFixed(2)}:1 (${foreground} sobre ${background})`,
      );
    });
  }
}
