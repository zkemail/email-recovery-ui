import { type Module } from "@rhinestone/module-sdk";
import {
  encodeValidatorNonce,
  getAccount,
  getWebAuthnValidator,
  getWebauthnValidatorMockSignature,
  getWebauthnValidatorSignature,
  WEBAUTHN_VALIDATOR_ADDRESS,
} from "@rhinestone/module-sdk";
import { PublicKey } from "ox";
import { sign } from "ox/WebAuthnP256";
import { SmartAccountClient } from "permissionless";
import { SafeSmartAccountImplementation } from "permissionless/accounts";
import { getAccountNonce } from "permissionless/actions";
import { Erc7579Actions } from "permissionless/actions/erc7579";
import { Call, Chain, Client, RpcSchema, Transport } from "viem";
import {
  entryPoint07Address,
  getUserOperationHash,
  WebAuthnAccount,
} from "viem/account-abstraction";
import { SmartAccount } from "viem/account-abstraction";
import { baseSepolia } from "viem/chains";
import { pimlicoClient, publicClient } from "./client";

export const getWebAuthnValidatorFromWebAuthnAccount = (
  account: WebAuthnAccount,
): Module => {
  const { x, y, prefix } = PublicKey.from(account.publicKey);
  const webauthnValidator = getWebAuthnValidator({
    pubKey: { x, y, prefix },
    authenticatorId: account.id,
  });

  return webauthnValidator;
};

export const sendTransactionFromSafeWithWebAuthn = async (
  ownerAccount: WebAuthnAccount,
  smartAccountClient: SmartAccountClient<
    Transport,
    Chain,
    SmartAccount<SafeSmartAccountImplementation>,
    Client,
    RpcSchema
  > &
    Erc7579Actions<SmartAccount<SafeSmartAccountImplementation>>,
  call: Call,
) => {
  const nonce = await getAccountNonce(publicClient, {
    address: smartAccountClient.account.address,
    entryPointAddress: entryPoint07Address,
    key: encodeValidatorNonce({
      account: getAccount({
        address: smartAccountClient.account.address,
        type: "safe",
      }),
      validator: WEBAUTHN_VALIDATOR_ADDRESS,
    }),
  });

  const userOperation = await smartAccountClient.prepareUserOperation({
    account: smartAccountClient.account,
    calls: [call],
    nonce,
    signature: getWebauthnValidatorMockSignature(),
  });

  const userOpHashToSign = getUserOperationHash({
    chainId: baseSepolia.id,
    entryPointAddress: entryPoint07Address,
    entryPointVersion: "0.7",
    userOperation,
  });

  const { metadata: webauthn, signature } = await sign({
    credentialId: ownerAccount.id,
    challenge: userOpHashToSign,
  });

  const encodedSignature = getWebauthnValidatorSignature({
    webauthn,
    signature,
    usePrecompiled: false,
  });

  userOperation.signature = encodedSignature;

  const opHash = await smartAccountClient.sendUserOperation(userOperation);

  console.log("User Operation Hash:", opHash);

  const receipt = await pimlicoClient.waitForUserOperationReceipt({
    hash: opHash,
  });

  console.log("User Operation Receipt:", receipt);

  return receipt;
};
