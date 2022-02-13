import { IPendingTxn } from "./pending-txns-slice";
import { IAppSlice } from "./app-slice";
import { MessagesState } from "./messages-slice";

export interface IReduxState {
    pendingTransactions: IPendingTxn[];
    app: IAppSlice;
    messages: MessagesState;
}
