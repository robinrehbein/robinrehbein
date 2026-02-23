import { createDefine } from "fresh";

export interface State {
  auth?: string;
}

export const define = createDefine<State>();
