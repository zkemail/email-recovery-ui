import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { STEPS } from "../../constants";
import { StepsContext } from "../../App";
import { run } from "./deploy";
import { genAccountCode } from "../../utils/email";
import { useAppContext } from "../../context/AppContextHook";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { relayer } from "../../services/relayer";
import { abi as safeAbi } from "../../abi/Safe.json";
import { useGetSafeAccountAddress } from "../../utils/useGetSafeAccountAddress";
import { readContract } from "wagmi/actions";
import { config } from "../../providers/config";
import { abi as universalEmailRecoveryModuleAbi } from "../../abi/UniversalEmailRecoveryModule.json";
import { universalEmailRecoveryModule } from "../../../contracts.base-sepolia.json";
import { signerToSafeSmartAccount } from "permissionless/accounts";
import { ENTRYPOINT_ADDRESS_V07, walletClientToSmartAccountSigner } from "permissionless";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { baseSepolia } from "viem/chains";

export const publicClient = createPublicClient({
  transport: http("https://sepolia.base.org"),
});

const ConnectBurnerWallet = () => {
  // const address = useGetSafeAccountAddress();

  const [account, setAccount] = useState<string>(null);
  const [accountCreationError, setAccountCreationError] = useState(false);
  const stepsContext = useContext(StepsContext);
  const { guardianEmail, setGuardianEmail, accountCode, setAccountCode } =
    useAppContext();
    const [isTrue, setIsTrue] = useState(false);
  

  const connectWallet = async () => {
    setIsTrue(true);
    // Assuming install function sets the account
    const addresses = await window.ethereum.request({
      method: "eth_requestAccounts",
    }); // Cast the result to string[]
    const [address] = addresses;

    try {
      const client = createWalletClient({
        account: address, // Type assertion to match the expected format
        chain: baseSepolia,
        transport: custom(window.ethereum),
      });

      const safeAccount = await signerToSafeSmartAccount(publicClient, {
        signer: walletClientToSmartAccountSigner(client),
        safeVersion: "1.4.1",
        entryPoint: ENTRYPOINT_ADDRESS_V07,
        saltNonce: 10n,
        safe4337ModuleAddress: "0x3Fdb5BC686e861480ef99A6E3FaAe03c0b9F32e2",
        erc7569LaunchpadAddress: "0xEBe001b3D534B9B6E2500FB78E67a1A137f561CE",
        validators: [
          { address: "0xd9Ef4a48E4C067d640a9f784dC302E97B21Fd691", context: "0x" },
        ],
      });

      console.log(safeAccount, "safeAccount");
    

      const acctCode = await genAccountCode();

      if(localStorage.getItem("accountCode")) {
        return;
      }

      console.log(acctCode, "acctCode");

      localStorage.setItem("accountCode", acctCode);
      await setAccountCode(accountCode);

      const guardianSalt = await relayer.getAccountSalt(
        acctCode,
        "shubham.agarwal8856@gmail.com"
      )

      const guardianAddr = await readContract(config, {
        abi: universalEmailRecoveryModuleAbi,
        address: universalEmailRecoveryModule as `0x${string}`,
        functionName: "computeEmailAuthAddress",
        args: [safeAccount.address, guardianSalt],
      });

      console.log(guardianAddr, safeAccount.address, guardianSalt, "computedGuardianAddr");

      const burnerWalletAddress = await run(client, safeAccount, guardianAddr);
      console.log(burnerWalletAddress, "account");
      setAccount(burnerWalletAddress);
      localStorage.setItem(
        "burnerWalletConfig",
        JSON.stringify({ burnerWalletAddress })
      );
      stepsContext?.setStep(STEPS.REQUEST_GUARDIAN);
    } catch (error) {
      console.log(error);
      setAccountCreationError(error);
    }
  };

  useLayoutEffect(() => {
    if (localStorage.getItem("burnerWalletConfig")) {
      return stepsContext?.setStep(STEPS.REQUEST_GUARDIAN);
    }
    if(!isTrue) {
      connectWallet();
    }
  }, []);

  if (accountCreationError) {
    return (
      <div>
        Something went wrong, please try again...
        <button color="primary" onClick={connectWallet}>
          Retry Creating wallet
        </button>
      </div>
    );
  }

  return <div>Creating wallet... </div>;
};

export default ConnectBurnerWallet;
