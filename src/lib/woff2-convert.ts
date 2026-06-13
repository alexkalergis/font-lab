import { woff2 } from "fonteditor-core";

let woff2Initialized = false;

export async function convertToSfnt(buffer: ArrayBuffer, fileName: string): Promise<ArrayBuffer> {
  const ext = fileName.split(".").pop()?.toLowerCase();

  if (ext === "woff2") {
    if (!woff2Initialized) {
      await woff2.init("/woff2.wasm");
      woff2Initialized = true;
    }
    const ttfBuffer = woff2.decode(buffer);
    return ttfBuffer.buffer as ArrayBuffer;
  }

  // TTF/OTF/WOFF(v1) — opentype.js handles these natively
  return buffer;
}
