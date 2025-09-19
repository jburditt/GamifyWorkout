import { ActionReducer, INIT, UPDATE } from "@ngrx/store";
import { State } from "./player.reducer";

export const hydrationMetaReducer = (
  reducer: ActionReducer<State>
): ActionReducer<State> => {
  return (state, action) => {
    // console.log("Hydration Meta Reducer", action, state);
    // if (action.type === INIT || action.type === UPDATE) {
    //   const storageValue = localStorage.getItem("state");
    //   if (storageValue) {
    //     try {
    //       return JSON.parse(storageValue);
    //     } catch {
    //       localStorage.removeItem("state");
    //     }
    //   }
    // }
    const nextState = reducer(state, action);
    // localStorage.setItem("state", JSON.stringify(nextState));
    return nextState;
  };
};
