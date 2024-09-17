import { buildPoseidon } from "circomlibjs";

export const templateIdx = 0;

export function bytesToHex(bytes: Uint8Array) {
  return [...bytes]
    .reverse()
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

export async function genAccountCode(): Promise<string> {
  const poseidon = await buildPoseidon();
  const accountCodeBytes: Uint8Array = poseidon.F.random();
  return bytesToHex(accountCodeBytes);
}
