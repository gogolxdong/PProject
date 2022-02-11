import { Networks } from "./blockchain";

const BSC_TESTNET = {
    ADDRESS: "0x2f5514af7F9a5B4ffc217160CCF69b71675129aC",
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.BSC_TESTNET) return BSC_TESTNET;

    throw Error("Network don't support");
};
