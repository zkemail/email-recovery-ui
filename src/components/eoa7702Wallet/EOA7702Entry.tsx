import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { createWalletClient, http } from "viem";
import {
  createWebAuthnCredential,
  P256Credential,
} from "viem/account-abstraction";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { upgradeEOAWith7702 } from "./auth";
import {
  getSafeAccount,
  getSafeSmartAccountClient,
  publicClient,
} from "./client";
import { StepsContext } from "../../App";
import { STEPS } from "../../constants";
import { useBurnerAccount } from "../../context/BurnerAccountContext";
import { useOwnerPasskey } from "../../context/OwnerPasskeyContext";
import { Button } from "../Button";
import ConnectionInfoCard from "../ConnectionInfoCard";
import Loader from "../Loader";

const EOA7702Entry = () => {
  const {
    ownerPasskeyCredential,
    ownerPasskeyAccount,
    setOwnerPasskeyCredential,
    isLoading: isOwnerPasskeyLoading,
  } = useOwnerPasskey();

  const { setBurnerAccountClient, burnerAccount, setBurnerAccount } =
    useBurnerAccount();
  const stepsContext = useContext(StepsContext);

  const [isAccountInitializedLoading, setIsAccountInitializedLoading] =
    useState(false);
  const [isBurnerWalletUpgrading, setIsBurnerWalletUpgrading] = useState(false);
  const [isCodeSet, setIsCodeSet] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if the burner wallet is already upgraded to a safe account via 7702
  const checkIfEOA7702AccountInitialized = useCallback(async () => {
    setIsAccountInitializedLoading(true);
    const burnerEOA7702OwnerAddress =
      localStorage.getItem("burnerEOA7702Owner");
    const burnerEOA7702OwnerPrivateKey = localStorage.getItem(
      "burnerEOA7702OwnerPrivateKey",
    );
    if (burnerEOA7702OwnerAddress && burnerEOA7702OwnerPrivateKey) {
      try {
        const burnerEOA7702Owner = privateKeyToAccount(
          burnerEOA7702OwnerPrivateKey as `0x${string}`,
        );
        setBurnerAccount(burnerEOA7702Owner);

        const code = await publicClient.getCode({
          address: burnerEOA7702Owner.address,
        });

        if (code !== "0x" && code !== undefined) {
          const burnerWalletClient = createWalletClient({
            account: burnerEOA7702Owner,
            chain: baseSepolia,
            transport: http(),
          });

          setBurnerAccountClient(burnerWalletClient);
          setIsCodeSet(true);
          stepsContext?.setStep(STEPS.REQUEST_GUARDIAN);
        }
      } catch (err) {
        console.error(
          "Error initializing burner account from localStorage:",
          err,
        );
        toast.error("Failed to load existing burner account. Please refresh.");
      }
    } else {
      console.warn(
        "Burner EOA details not found in localStorage. User might need to go through a setup step if this is unexpected.",
      );
    }
    setIsAccountInitializedLoading(false);
  }, [setBurnerAccount, setBurnerAccountClient, stepsContext]);

  // Check if the burner wallet is already present
  useEffect(() => {
    checkIfEOA7702AccountInitialized();

    const currentIntervalRef = intervalRef.current;
    return () => {
      if (currentIntervalRef) {
        clearInterval(currentIntervalRef);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createPassKeyAccount = async (): Promise<
    P256Credential | undefined
  > => {
    if (ownerPasskeyCredential) {
      console.log("Passkey already created and in context");
      toast.success(
        "Passkey already available. Please proceed to the next step.",
      );
      return ownerPasskeyCredential;
    }
    try {
      const credential = await createWebAuthnCredential({
        name: "zkemail.recovery.demo",
      });
      console.log("Passkey created", credential);
      setOwnerPasskeyCredential(credential);
      return credential;
    } catch (error) {
      console.error("Error creating passkey:", error);
      toast.error("Failed to create passkey. Please try again.");
      return undefined;
    }
  };

  const upgradeEOA = async () => {
    setIsBurnerWalletUpgrading(true);

    if (!ownerPasskeyAccount) {
      toast.error(
        "Owner passkey account not available. Please create/select a passkey first.",
      );
      setIsBurnerWalletUpgrading(false);
      return;
    }

    if (!burnerAccount) {
      console.log("No burner account found! Cannot upgrade.");
      toast.error("Burner account is not initialized. Please wait or refresh.");
      setIsBurnerWalletUpgrading(false);
      return;
    }

    const burnerWalletClient = createWalletClient({
      account: burnerAccount,
      chain: baseSepolia,
      transport: http(),
    });
    setBurnerAccountClient(burnerWalletClient);

    try {
      const safeAccount = await getSafeAccount(
        ownerPasskeyAccount,
        burnerAccount,
      );
      const smartAccountClient = await getSafeSmartAccountClient(
        ownerPasskeyAccount,
        burnerAccount,
      );

      await upgradeEOAWith7702(burnerWalletClient, ownerPasskeyAccount);

      localStorage.setItem("safeAccount", JSON.stringify(safeAccount));

      localStorage.setItem(
        "smartAccountClient",
        JSON.stringify(smartAccountClient),
      );

      setIsCodeSet(true);
      toast.success("EOA successfully upgraded to a smart account!");
      stepsContext?.setStep(STEPS.REQUEST_GUARDIAN);
    } catch (e: unknown) {
      if (!(e instanceof Error)) {
        console.error("Unexpected error during EOA upgrade:", e);
      } else {
        console.error("Error during EOA upgrade:", e);
        const errorMessage =
          e.shortMessage ||
          e.message ||
          "An unknown error occurred during upgrade.";
        toast.error(`Upgrade failed: ${errorMessage}`);
      }
    } finally {
      setIsBurnerWalletUpgrading(false);
    }
  };

  if (
    (isAccountInitializedLoading || isOwnerPasskeyLoading) &&
    !isBurnerWalletUpgrading
  ) {
    return <Loader />;
  }

  return (
    <Box
      sx={{
        textAlign: "center",
        marginX: "auto",
        maxWidth: "600px",
        padding: "2rem",
      }}
    >
      {!ownerPasskeyCredential ? (
        <>
          <Typography variant="h2" sx={{ paddingBottom: "1.5rem" }}>
            Create Your Passkey
          </Typography>
          <ConnectionInfoCard />
          <Button
            onClick={createPassKeyAccount}
            variant={"contained"}
            fullWidth={false}
            sx={{ minWidth: "220px", marginBottom: "1rem" }}
          >
            Create
          </Button>

          <Typography
            variant="body1"
            sx={{
              paddingBottom: "2rem",
              color: "text.secondary",
              textAlign: "left",
              whiteSpace: "pre-line",
            }}
          >
            {`To begin, please create a Passkey. This will allow you to:
• Upgrade the standard burner EOA to a Smart Account using EIP-7702.
• Make the passkey the primary owner of your new Smart EOA
• Enable features like transaction batching, session keys, and enhanced security on the EOA
• Keep everything controlled by your passkey.`}
          </Typography>
        </>
      ) : !isCodeSet ? (
        <>
          <Typography variant="h2" sx={{ paddingBottom: "1.5rem" }}>
            Upgrade Your EOA
          </Typography>
          <ConnectionInfoCard />
          <Typography
            variant="body1"
            sx={{
              paddingBottom: "0.5rem",
              color: "text.secondary",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Your local EOA (burner wallet) is ready.
            <CheckCircleIcon sx={{ color: "green", marginLeft: "0.5rem" }} />
          </Typography>

          <Button
            disabled={isBurnerWalletUpgrading || !burnerAccount}
            loading={isBurnerWalletUpgrading}
            onClick={upgradeEOA}
            variant={"contained"}
            sx={{ minWidth: "220px" }}
          >
            {isBurnerWalletUpgrading
              ? "Upgrading..."
              : burnerAccount
                ? "Upgrade to Smart Account"
                : "Initializing Account..."}
          </Button>

          <Typography
            variant="body1"
            sx={{
              paddingTop: "1rem",
              paddingBottom: "2rem",
              color: "text.secondary",
            }}
          >
            Click the button above to upgrade it to a Safe(v1.4.1) smart account
            using <strong>EIP-7702</strong>. Your connected passkey will be set
            as an owner.
          </Typography>
          {!burnerAccount && !isBurnerWalletUpgrading && (
            <Typography
              variant="caption"
              display="block"
              sx={{ marginTop: "1rem", color: "warning.main" }}
            >
              Waiting for burner account initialization. If this persists,
              please refresh the page.
            </Typography>
          )}
        </>
      ) : (
        <>
          <Typography variant="h2" sx={{ paddingBottom: "1.5rem" }}>
            Account Successfully Upgraded!
          </Typography>
          <ConnectionInfoCard />
          <Typography
            variant="body1"
            sx={{ paddingBottom: "2rem", color: "text.secondary" }}
          >
            Your EOA has been enhanced into a smart account. Redirecting you to
            the next step...
          </Typography>
          <Loader />
        </>
      )}
    </Box>
  );
};

export default EOA7702Entry;
