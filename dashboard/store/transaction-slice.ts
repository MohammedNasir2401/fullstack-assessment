import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit';
import { Transaction } from '@/lib/interfaces/transaction';

export interface TransactionState {
    mappedTransactions: Record<string, Transaction[]>;
    loadingMap: Record<string, boolean>;
    error: string | null;
}

const initialState: TransactionState = {
    mappedTransactions: {},
    loadingMap: {},
    error: null,
};

export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async ({ id, dataSource }: { id: string; dataSource: string }) => {
        const params = new URLSearchParams({
            source: dataSource,
            startDate: id.split("|")[0],
            endDate: id.split("|")[1],
        });
        const url = process.env.NEXT_PUBLIC_API_URL + '/report/records?' + params.toString();
        const response = await fetch(url, {
            cache: 'no-store',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }
        const jsonData = await response.json();
        return { id, transactions: jsonData.records ?? [] };
    }
);

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearTransactions: (state) => {
            state.mappedTransactions = {};
            state.loadingMap = {};
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state, action) => {
                const { id } = action.meta.arg;
                state.loadingMap[id] = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                const { id, transactions } = action.payload;
                state.mappedTransactions[id] = transactions;
                state.loadingMap[id] = false;
                state.error = null;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                const { id } = action.meta.arg;
                state.loadingMap[id] = false;
                state.error = action.error.message || 'Failed to fetch transactions';
            });
    },
});

export const { clearError, clearTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;