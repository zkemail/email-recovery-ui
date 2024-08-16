import { defineConfig } from '@wagmi/cli'
import { foundry, react } from '@wagmi/cli/plugins'
import { safeEmailRecoveryModuleAbi } from "./src/abi/SafeEmailRecoveryModule"
import { safeAbi } from "./src/abi/Safe"
// TODO Fully link into project
export default defineConfig({
    out: 'src/abis.ts',
    contracts: [
        {
            name: "safeEmailRecoveryModule",
            abi: safeEmailRecoveryModuleAbi
        },
        {
            name: "safe",
            abi: safeAbi
        }
    ]
    // plugins: [
    //     foundry({
    //         project: "../../plugins",
    //         include: [
    //             "EmailAccountRecovery.sol/**",
    //             "Safe.sol/**",
    //             "SafeZkEmailRecoveryPlugin.sol/**",
    //             "SimpleWallet.sol/**",
    //         ],
    //     }),
    //     react()
    // ],
})
