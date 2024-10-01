import { configureStore, combineReducers, Reducer } from "@reduxjs/toolkit";
import authReducer, { AuthState } from "@/app/store/authSlice";

// Root state arayüzü
interface Root {
  auth: AuthState;
}

// Yerel depolama (localStorage) durumunu yüklemek için fonksiyon
function loadState() {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
}

// Yerel depolama (localStorage) durumunu kaydetmek için fonksiyon
function saveState(state: Root) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (e) {
    // Yazma hatalarını yoksay
  }
}

// Root reducer oluşturma
const rootReducer: Reducer<Root> = combineReducers({
  auth: authReducer,
});

// Store'u oluşturma ve yapılandırma
export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: loadState(),
  });

  // Store değişikliklerini yerel depolama (localStorage) ile senkronize etme
  store.subscribe(() => {
    saveState(store.getState() as Root);
  });

  return store;
};

// Store türlerini çıkarma
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
