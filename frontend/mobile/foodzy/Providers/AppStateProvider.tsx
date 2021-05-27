import * as React from "react";
import { useState } from "react";
import { AppContext } from "./contexts";

const AppStateProvider:React.FC<any> = ({children}) => {
  const [appState, setAppState] = useState({
    isAuth: false,
  });
  return (
    <AppContext.Provider
      value={{
        appState,
        setAppState,
      }}
    >
    {children}
    </AppContext.Provider>
  );
}

export default React.memo(AppStateProvider);
