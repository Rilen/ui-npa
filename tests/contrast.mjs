export function contrastRatio(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function luminance(color) {
  const channels = parseHex(color).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function parseHex(color) {
  if (typeof color !== "string" || !/^#[0-9a-f]{6}$/.test(color)) {
    throw new Error(`Contraste exige cor opaca de 6 dígitos: ${color}`);
  }
  return [0, 2, 4].map((offset) => Number.parseInt(color.slice(offset + 1, offset + 3), 16));
}
