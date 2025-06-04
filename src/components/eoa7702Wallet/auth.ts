import {
  MOCK_ATTESTER_ADDRESS,
  type Module,
  RHINESTONE_ATTESTER_ADDRESS,
} from "@rhinestone/module-sdk";
import {
  createWalletClient,
  encodeFunctionData,
  Hex,
  http,
  parseAbi,
  WalletClient,
  zeroAddress,
} from "viem";
import { WebAuthnAccount } from "viem/account-abstraction";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

import { deadOwner } from "./client.ts";
import { getWebAuthnValidatorFromWebAuthnAccount } from "./utils.ts";
import {
  erc7569LaunchpadAddress,
  safe4337ModuleAddress,
  safeSingletonAddress,
} from "../../../contracts.base-sepolia.json";
import { safeAbi } from "../../abi/Safe";
import config from "../burnerWallet/config";

if (!import.meta.env.VITE_7702_RELAYER_URL) {
  if (!import.meta.env.VITE_7702_RELAYER_PRIVATE_KEY) {
    throw new Error("7702_RELAYER env does not exist");
  }
}

const RELAYER_7702_URL = import.meta.env.VITE_7702_RELAYER_URL;

const DEFAULT_SIGNER_THRESHOLD = 1n;

export async function upgradeEOAWith7702(
  burner: WalletClient,
  owner: WebAuthnAccount,
): Promise<Hex> {
  const authorization = await burner.signAuthorization({
    account: burner.account!,
    contractAddress: safeSingletonAddress as `0x${string}`,
  });

  const webAuthnValidator = getWebAuthnValidatorFromWebAuthnAccount(owner);

  // Parameters for Safe's setup call.
  const owners = [deadOwner.address];
  const signerThreshold = DEFAULT_SIGNER_THRESHOLD;
  const setupAddress = erc7569LaunchpadAddress as `0x${string}`;

  // This will enable the 7579 adaptor to be used with this safe on setup.
  const setupData = getSafeLaunchpadSetupData(webAuthnValidator);

  const fallbackHandler = safe4337ModuleAddress as `0x${string}`; // Safe 7579 Adaptor address
  const paymentToken = zeroAddress;
  const paymentValue = 0n;
  const paymentReceiver = zeroAddress;

  const data = encodeFunctionData({
    abi: safeAbi,
    functionName: "setup",
    args: [
      owners,
      signerThreshold,
      setupAddress,
      setupData,
      fallbackHandler,
      paymentToken,
      paymentValue,
      paymentReceiver,
    ],
  });
  let txHash: Hex;

  const RELAYER_PRIVATE_KEY = import.meta.env
    .VITE_7702_RELAYER_PRIVATE_KEY as `0x${string}`;

  if (RELAYER_PRIVATE_KEY) {
    const relayAccount = privateKeyToAccount(RELAYER_PRIVATE_KEY);

    const relayClient = createWalletClient({
      account: relayAccount,
      chain: baseSepolia,
      transport: http(config.rpcUrl),
    });

    txHash = await relayClient.writeContract({
      address: burner.account!.address,
      abi: safeAbi,
      functionName: "setup",
      args: [
        owners,
        signerThreshold,
        setupAddress,
        setupData,
        fallbackHandler,
        paymentToken,
        paymentValue,
        paymentReceiver,
      ],
      authorizationList: [authorization],
    });
  } else if (RELAYER_7702_URL) {
    const relay_req = {
      to: burner.account!.address,
      data,
      authorization: {
        address: authorization.address,
        chainId: authorization.chainId,
        nonce: authorization.nonce,
        r: authorization.r,
        s: authorization.s,
        v: Number(authorization.v),
        yParity: authorization.yParity,
      },
    };

    // Call the relayer
    const res = await fetch(`${RELAYER_7702_URL}api/relay/delegate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(relay_req),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ message: res.statusText }));
      console.error("Error from relay delegate:", errorData);
      throw new Error(
        errorData.message || `Request failed with status ${res.status}`,
      );
    }

    const txData = await res.json();
    txHash = txData.txHash as Hex;
  } else {
    throw new Error("No relayer URL or private key provided");
  }

  console.log("EIP 7702 upgrde and setup tx Hash", txHash);

  return txHash;
}

export const getSafeLaunchpadSetupData = (webauthnValidator: Module) => {
  const erc7569LaunchpadCallData = encodeFunctionData({
    abi: parseAbi([
      "struct ModuleInit {address module;bytes initData;}",
      "function addSafe7579(address safe7579,ModuleInit[] calldata validators,ModuleInit[] calldata executors,ModuleInit[] calldata fallbacks, ModuleInit[] calldata hooks,address[] calldata attesters,uint8 threshold) external",
    ]),
    functionName: "addSafe7579",
    args: [
      safe4337ModuleAddress as `0x${string}`,
      [
        {
          module: webauthnValidator.address,
          initData: webauthnValidator.initData,
        },
      ],
      [],
      [],
      [],
      [RHINESTONE_ATTESTER_ADDRESS, MOCK_ATTESTER_ADDRESS],
      1,
    ],
  });

  return erc7569LaunchpadCallData;
};
