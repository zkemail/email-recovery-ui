import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { readContract } from "wagmi/actions";
import { Button } from "./Button";
import InputField from "./InputField";
import { safeEmailRecoveryModule } from "../../contracts.base-sepolia.json";
import { safeAbi } from "../abi/Safe";
import { safeEmailRecoveryModuleAbi } from "../abi/SafeEmailRecoveryModule";
import { StepsContext } from "../App";
import { STEPS } from "../constants";
import { config } from "../providers/config";
import { relayer } from "../services/relayer";

const AddGuardianModal = ({
  open,
  handleClose,
  newGuardianAddress,
  setNewGuardianAddress,
  newGuardianEmail,
  setNewGuardianEmail,
  handleAddGuardian,
  isAddGuardianLoading,
}: {
  open: boolean;
  handleClose: () => void;
  newGuardianAddress: string;
  setNewGuardianAddress: (address: string) => void;
  newGuardianEmail: string;
  setNewGuardianEmail: (email: string) => void;
  handleAddGuardian: () => void;
  isAddGuardianLoading: boolean;
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-dialog-title"
      aria-describedby="parent-dialog-description"
      PaperProps={{
        style: {
          borderRadius: "16px",
          width: "40rem",
        },
      }}
    >
      <DialogTitle id="parent-dialog-title" style={{ fontWeight: "bold" }}>
        Add Guardian
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputField
              type="string"
              value={newGuardianAddress || ""}
              onChange={(e) => setNewGuardianAddress(e.target.value)}
              label="Guardian Address"
            />
          </Grid>
          <Grid item xs={12}>
            <InputField
              type="email"
              value={newGuardianEmail || ""}
              onChange={(e) => setNewGuardianEmail(e.target.value)}
              label="Guardian Email"
            />
          </Grid>
          <Grid item xs={6}>
            <Button onClick={handleClose} disabled={isAddGuardianLoading}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              onClick={handleAddGuardian}
              disabled={isAddGuardianLoading}
              loading={isAddGuardianLoading}
              filled={true}
            >
              Add Guardian
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

const ConfigureGuardians = () => {
  const isMobile = window.innerWidth < 768;

  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const stepsContext = useContext(StepsContext);
  const accountCode = localStorage.getItem("safe1_3AccountCode");

  const [newGuardianAddress, setNewGuardianAddress] = useState("");
  const [newGuardianEmail, setNewGuardianEmail] = useState("");
  const [isAddGuardianLoading, setIsAddGuardianLoading] = useState(false);
  const [isAddGuardianModalOpen, setIsAddGuardianModalOpen] = useState(false);

  const { data: safeOwnersData } = useReadContract({
    address,
    abi: safeAbi,
    functionName: "getOwners",
  });

  const getGuardianConfig = async () => {
    const getGuardianConfig = await readContract(config, {
      abi: safeEmailRecoveryModuleAbi,
      address: safeEmailRecoveryModule as `0x${string}`,
      functionName: "getGuardianConfig",
      args: [address as `0x${string}`],
    });
  };

  getGuardianConfig();

  if (!accountCode) {
    toast.error("Something went wrong");
    stepsContext?.setStep(STEPS.CONFIGURE_GUARDIANS);
  }

  const handleAddGuardian = async () => {
    setIsAddGuardianLoading(true);
    // The account code is unique for each account.
    const guardianSalt = await relayer.getAccountSalt(
      accountCode,
      newGuardianEmail
    );

    const guardianAddr = await readContract(config, {
      abi: safeEmailRecoveryModuleAbi,
      address: safeEmailRecoveryModule as `0x${string}`,
      functionName: "computeEmailAuthAddress",
      args: [newGuardianAddress, guardianSalt],
    });

    try {
      await writeContractAsync({
        abi: safeEmailRecoveryModuleAbi,
        address: safeEmailRecoveryModule as `0x${string}`,
        functionName: "addGuardian",
        args: [guardianAddr, 1n],
      });

      setIsAddGuardianModalOpen(false);
      toast.success("Guardian added successfully");
    } catch (err) {
      toast.error(`Something went wrong: ${err}`);
      console.log(err);
    } finally {
      setIsAddGuardianLoading(false);
    }
  };

  const handleRemoveGuardian = async (address: `0x${string}`) => {
    // TODO: get guardian email address
    const guardianSalt = await relayer.getAccountSalt(
      accountCode,
      newGuardianEmail
    );

    const guardianAddr = await readContract(config, {
      abi: safeEmailRecoveryModuleAbi,
      address: safeEmailRecoveryModule as `0x${string}`,
      functionName: "computeEmailAuthAddress",
      args: [address, guardianSalt],
    });

    await writeContractAsync({
      abi: safeEmailRecoveryModuleAbi,
      address: safeEmailRecoveryModule as `0x${string}`,
      functionName: "removeGuardian",
      args: [guardianAddr],
    });
  };

  return (
    <div className="connect-wallets-container">
      <Box
        sx={{
          marginX: "auto",
          marginTop: { xs: "2rem", sm: "9.375rem" },
          marginBottom: "6.25rem",
          maxWidth: isMobile ? "100%" : "50%",
        }}
      >
        <Typography variant="h2" sx={{ paddingBottom: "20px" }}>
          Configure Guardians
        </Typography>
        <Grid container spacing={4}>
          <Grid
            container
            item
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Grid item>
              <Typography variant="h5">Current guardians:</Typography>
            </Grid>
            <Grid item>
              <Button
                onClick={() => setIsAddGuardianModalOpen(true)}
                filled={true}
              >
                + Add Guardian
              </Button>
            </Grid>
          </Grid>
          <Grid container item spacing={2}>
            {/* TODO: Update guardian addresses */}
            {[
              safeOwnersData,
              "0xA22a81d92F78A24dD023A868DD93a09FCEa326c3",
              "0x70839221d17e106711DCfeC3f9bAEd4285bC9011",
            ]?.map((safeOwnerAddress) => (
              <Grid
                container
                item
                alignItems={"center"}
                justifyContent={"space-between"}
                direction={"row"}
              >
                <Grid item>
                  <Typography>{safeOwnerAddress}</Typography>
                </Grid>
                <Grid item>
                  <Button
                    onClick={() => handleRemoveGuardian(safeOwnerAddress)}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <AddGuardianModal
          open={isAddGuardianModalOpen}
          handleClose={() => setIsAddGuardianModalOpen(false)}
          newGuardianAddress={newGuardianAddress}
          setNewGuardianAddress={setNewGuardianAddress}
          newGuardianEmail={newGuardianEmail}
          setNewGuardianEmail={setNewGuardianEmail}
          handleAddGuardian={handleAddGuardian}
          isAddGuardianLoading={isAddGuardianLoading}
        />
      </Box>
    </div>
  );
};

export default ConfigureGuardians;
