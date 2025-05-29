if (!import.meta.env.VITE_PIMLICO_API_KEY) {
  throw new Error("VITE_PIMLICO_API_KEY does not exist");
}
if (!import.meta.env.VITE_ALCHEMY_API_KEY) {
  throw new Error("VITE_ALCHEMY_API_KEY does not exist");
}
if (!import.meta.env.VITE_RELAYER_URL) {
  throw new Error("VITE_RELAYER_URL does not exist");
}

type Config = {
  bundlerUrl: string;
  rpcUrl: string;
  relayerApiUrl: string;
};

const config: Config = {
  bundlerUrl: `https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${import.meta.env.VITE_PIMLICO_API_KEY}`,
  rpcUrl: `https://base-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,
  relayerApiUrl: `${import.meta.env.VITE_RELAYER_URL}`,
};

export default config;
