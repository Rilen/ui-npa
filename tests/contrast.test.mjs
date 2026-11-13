import assert from "node:assert/strict";
import test from "node:test";
import pairs from "./contrast-pairs.json" with { type: "json" };
import { contrastRatio } from "./contrast.mjs";
import { buildTokens } from "../scripts/build-tokens.mjs";

const model = buildTokens();
const themes = {
  light: model.light,
  dark: model.dark,
};

for (const [themeName, theme] of Object.entries(themes)) {
  for (const pair of pairs) {
    test(`${themeName}: ${pair.fg} sobre ${pair.bg} >= ${pair.min}`, () => {
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
