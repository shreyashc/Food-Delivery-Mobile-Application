import { AppState, User } from "../contexts/contexts";

export const appReducer = (state: AppState, action: Actions) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, ...action.payload, isAuth: true };
    case "LOGOUT":
      return { ...state, isAuth: false, user: null, token: null };
    case "SAVED_STATE":
      return { ...action.payload };
    default:
      return state;
  }
};

export type Actions =
  | { type: "LOGIN"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "SAVED_STATE"; payload: any };