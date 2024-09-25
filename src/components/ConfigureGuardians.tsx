import { useContext, useState } from "react";
import { readContract } from "wagmi/actions";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { Button } from "./Button";
import InputField from "./InputField";
import { safeEmailRecoveryModule } from "../../contracts.base-sepolia.json";
import { safeAbi } from "../abi/Safe";
import { safeEmailRecoveryModuleAbi } from "../abi/SafeEmailRecoveryModule";
import { config } from "../providers/config";
import { relayer } from "../services/relayer";
import { Box, Grid, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { STEPS } from "../constants";
import { StepsContext } from "../App";

const ConfigureGuardians = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const stepsContext = useContext(StepsContext);

  const [newGuardianAddress, setNewGuardianAddress] = useState("");
  const [newGuardianEmail, setNewGuardianEmail] = useState("");
  const accountCode = localStorage.getItem("safe1_3AccountCode");

  const { data: safeOwnersData } = useReadContract({
    address,
    abi: safeAbi,
    functionName: "getOwners",
  });

  if (!accountCode) {
    toast.error("Something went wrong");
    stepsContext?.setStep(STEPS.CONFIGURE_GUARDIANS);
  }

  console.log(safeOwnersData, "safeOwnersData");

  const handleAddGuardian = async () => {
    // The account code is unique for each account.

    const guardianSalt = await relayer.getAccountSalt(
      accountCode,
      newGuardianEmail
    );

    console.log(newGuardianAddress, guardianSalt);

    const guardianAddr = await readContract(config, {
      abi: safeEmailRecoveryModuleAbi,
      address: safeEmailRecoveryModule as `0x${string}`,
      functionName: "computeEmailAuthAddress",
      args: [newGuardianAddress, guardianSalt],
    });

    console.log(guardianAddr, "guardianAddr");
    const res = await writeContractAsync({
      abi: safeEmailRecoveryModuleAbi,
      address: safeEmailRecoveryModule as `0x${string}`,
      functionName: "addGuardian",
      args: [guardianAddr, 1n],
    });

    console.log(res);
  };

  const handleRemoveGuardian = async (address: `0x${string}`) => {
    await writeContractAsync({
      abi: safeEmailRecoveryModuleAbi,
      address: safeEmailRecoveryModule as `0x${string}`,
      functionName: "removeGuardian",
      args: [address],
    });
  };

  const handleEditGuardian = async (address: `0x${string}`) => {
    handleRemoveGuardian(address);
    handleAddGuardian();
  };

  return (
    <div className="connect-wallets-container">
      <Box sx={{ marginX: "auto", marginTop: "150px" }}>
        <Typography variant="h2" sx={{ paddingBottom: "20px" }}>
          Configure Guardians
        </Typography>
        <Typography variant="h5">Current guardians:</Typography>
        {safeOwnersData?.map((safeOwnerAddress) => (
          <Grid container alignItems={"center"}>
            <Grid item xs={8}>
              <Typography>{safeOwnerAddress}</Typography>
            </Grid>
            <Grid item xs={4} container spacing={2}>
              <Grid item>
                <Button onClick={() => handleEditGuardian(safeOwnerAddress)}>
                  Edit
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={() => handleRemoveGuardian(safeOwnerAddress)}>
                  Remove
                </Button>
              </Grid>
            </Grid>
          </Grid>
        ))}
        {/* each one of these will have 2 buttons, edit and remove. Edit button will remove and add a new guardian at the same time */}
        Add guardian: input field
        <InputField
          type="string"
          value={newGuardianAddress || ""}
          onChange={(e) => setNewGuardianAddress(e.target.value)}
          label="Guardian Address"
        />
        <InputField
          type="email"
          value={newGuardianEmail || ""}
          onChange={(e) => setNewGuardianEmail(e.target.value)}
          label="Guardian Email"
        />
        <Button onClick={() => handleAddGuardian()}>Add Guardian</Button>
      </Box>
    </div>
  );
};

export default ConfigureGuardians;
