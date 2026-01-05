import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
}

const getInitialState = (): AuthState => {
    const accessToken = localStorage.getItem('accessToken');
    return {
        user: null,
        accessToken,
        isAuthenticated: !!accessToken,
    };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; accessToken: string }>
        ) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
            localStorage.setItem('accessToken', action.payload.accessToken);
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload.accessToken;
            localStorage.setItem('accessToken', action.payload.accessToken);
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem('accessToken');
        },
    },
});

export const { setCredentials, setAccessToken, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
