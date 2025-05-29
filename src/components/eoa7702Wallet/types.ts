export interface GuardianConfig {
  guardianHash: `0x${string}`;
  threshold: bigint;
  acceptedWeight: bigint;
  recoveryConfiguredAt: bigint;
}

export type AcceptanceCommandTemplatesResult = string[][];
