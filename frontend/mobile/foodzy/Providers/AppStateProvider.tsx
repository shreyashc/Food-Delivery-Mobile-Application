import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../contexts/contexts";
import { appReducer } from "../reducers/appReducer";

const AppStateProvider: React.FC = ({ children }) => {
  const [appState, dispatch] = React.useReducer<React.Reducer<any, any>>(
    appReducer,
    null
  );

  React.useEffect(() => {
    async function loadSavedState() {
      const savedAppState = await getSavedAppState();
      dispatch({ type: "SAVED_STATE", payload: savedAppState });
    }
    loadSavedState();
  }, []);

  React.useEffect(() => {
    const storeData = async () => {
      try {
        if (appState) {
          const jsonValue = JSON.stringify(appState);
          await AsyncStorage.setItem("@app_state", jsonValue);
        }
      } catch (e) {
        console.log(e);
      }
    };
    storeData();
  }, [appState]);

  return (
    <AppContext.Provider value={{ appState, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const getSavedAppState = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@app_state");
    return jsonValue
      ? JSON.parse(jsonValue)
      : { isAuth: false, token: null, user: null };
  } catch (e) {
    console.log(e);
    return { isAuth: false, token: null, user: null };
  }
};

export default AppStateProvider;
