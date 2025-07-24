import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RecentNetProfits } from '@/lib/interfaces/recent-net-profits';
import { ProfitLossData } from '@/lib/interfaces/profit-loss-data';

interface ChartDataInterface {
    recentNetProfits: RecentNetProfits;
    data: ProfitLossData[];
}

interface ChartState {
    data: ChartDataInterface | null;
    loading: boolean;
    error: string | null;
}

const initialState: ChartState = {
    data: null,
    loading: false,
    error: null,
};

export const fetchChartData = createAsyncThunk(
    'chart/fetchData',
    async (_, { rejectWithValue }) => {
        try {
            const url = process.env.NEXT_PUBLIC_API_URL + '/report/chart-data';
            const res = await fetch(url, {
                cache: 'no-store',
            });
            if (!res.ok) {
                throw new Error(`Error fetching chart data`);
            }
            return await res.json();
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'Unknown error occurred'
            );
        }
    }
);

const chartSlice = createSlice({
    name: 'chart',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchChartData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChartData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchChartData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {} = chartSlice.actions;
export default chartSlice.reducer;