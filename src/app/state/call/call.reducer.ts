import { Call } from "../../Models/call.model";
export const Init_Call = 'Init_Call';
export function InitCallReducer(state: Call[] =[], action:any) {
  switch (action.type) {
    case Init_Call:
        return [...state,action.payload];
    default:
        return state;
    }
}