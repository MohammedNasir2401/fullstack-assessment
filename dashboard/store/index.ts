import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import profitLossReducer from './profit-loss-slice';
import chartReducer from './chart-slice';
import transactionReducer from './transaction-slice';

export const store = configureStore({
    reducer: {
        profitLoss: profitLossReducer,
        chart: chartReducer,
        transactions: transactionReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;