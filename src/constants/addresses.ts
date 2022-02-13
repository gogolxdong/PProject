import { Networks } from "./blockchain";

const BSC_TESTNET = {
    ADDRESS: "0x2A6B654B1B8d6331b17387367eD777839e0a20Fa",
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.BSC_TESTNET) return BSC_TESTNET;

    throw Error("Network don't support");
};
