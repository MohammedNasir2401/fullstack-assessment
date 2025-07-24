import { ProfitLossData } from '@/lib/interfaces/profit-loss-data';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface ProfitLossState {
    data: ProfitLossData[];
    loading: boolean;
    error: string | null;
}

const initialState: ProfitLossState = {
    data: [],
    loading: false,
    error: null,
};

export const fetchProfitLoss = createAsyncThunk(
    'profitLossReport',
    async (
        params: { source: string; },
        { rejectWithValue }
    ) => {
        try {
            const searchParams = new URLSearchParams(params);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/report/profit-loss?${searchParams.toString()}`;
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) {
                throw new Error(`Error fetching profit-loss data`);
            }
            return await res.json();
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'Unknown error occurred'
            );
        }
    }
);

const profitLossSlice = createSlice({
    name: 'profitLoss',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchProfitLoss.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfitLoss.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchProfitLoss.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default profitLossSlice.reducer;
