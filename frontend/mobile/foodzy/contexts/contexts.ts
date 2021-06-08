import { createContext, Dispatch } from "react";
import { Actions } from "../reducers/appReducer";

export const AppContext = createContext<any>(null);

export interface AppState {
  isAuth: boolean;
  token: string;
  user: User | null;
}

export interface User {
  id: number;
  email: string;
  role: string;
  customer: {
    displayName: string;
    address: string;
    phone: string;
  };
}

export interface InitContextProps {
  appState: AppState;
  dispatch: Dispatch<Actions>;
}
