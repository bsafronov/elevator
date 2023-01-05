import { IElevator } from "./IElevator";

export interface IFloor {
  readonly level: number;
  isWaiting: boolean;
  managedBy: IElevator | null;
}
