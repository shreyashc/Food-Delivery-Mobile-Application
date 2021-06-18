import { AppState, User } from "../contexts/contexts";

export const appReducer = (state: AppState, action: Actions) => {
  switch (action.type) {
    case "LOGIN":
      const newState = { ...state, ...action.payload, isAuth: true };
      console.log("newState", newState);
      return newState;
    case "LOGOUT":
      return null;
    case "SAVED_STATE":
      return { ...action.payload };
    case "UPDATE_PROFILE":
      return {
        ...state,
        user: {
          ...state.user,
          customer: { ...state?.user?.customer, ...action.payload },
        },
      };
    default:
      return state;
  }
};

export type Actions =
  | { type: "LOGIN"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "SAVED_STATE"; payload: any }
  | { type: "UPDATE_PROFILE"; payload: { phone: string; address: string } };
