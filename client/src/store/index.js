import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false, user: null },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload || state.user;
    },
    updateUser(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      localStorage.removeItem("userId");
      localStorage.removeItem("authToken");
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    isDarkmode: false,
  },
  reducers: {
    setDarkmode: (state, action) => {
      state.isDarkmode = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export const setDarkmode = themeSlice.actions.setDarkmode;

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  theme: themeSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
