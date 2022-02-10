import { BigNumber, ethers } from "ethers";
import { getAddresses } from "../../constants";
import { TimeTokenContract, TestContract, MemoTokenContract, DaiTokenContract, wMemoTokenContract } from "../../abi";
import { setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import React from "react";
import { RootState } from "../store";
import { BooleanArraySupportOption } from "prettier";

interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        slwh: string;
        lwh: string;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    const addresses = getAddresses(networkID);

    const memoContract = new ethers.Contract(addresses.sOHM_ADDRESS, MemoTokenContract, provider);
    const memoBalance = await memoContract.balanceOf(address);
    const timeContract = new ethers.Contract(addresses.OHM_ADDRESS, TimeTokenContract, provider);
    const timeBalance = await timeContract.balanceOf(address);

    // const wmemoContract = new ethers.Contract(addresses.WMEMO_ADDRESS, wMemoTokenContract, provider);
    // const wmemoBalance = await wmemoContract.balanceOf(address);
    // console.log("wmemoBalance:", wmemoBalance);

    return {
        balances: {
            slwh: ethers.utils.formatUnits(memoBalance, "gwei"),
            lwh: ethers.utils.formatUnits(timeBalance, "gwei"),
            // wmemo: ethers.utils.formatEther(wmemoBalance),
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    return {};
});

export interface IUserBondDetails {
    allowance: number;
    balance: number;
    avaxBalance: number;
    interestDue: number;
    bondMaturationBlock: number;
    pendingPayout: number; //Payout formatted in gwei.
}

export interface IUserTokenDetails {
    allowance: number;
    balance: number;
    isAvax?: boolean;
}

export interface ISonSlice {
    address: string;
    profit: BigNumber;
}
export interface IAccountSlice {
    loading: boolean;
}

const initialState: IAccountSlice = {
    loading: true,
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = true;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(getBalances.pending, state => {
                state.loading = true;
            })
            .addCase(getBalances.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getBalances.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
