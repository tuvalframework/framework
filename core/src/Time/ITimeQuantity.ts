import { ITimeMeasurement } from "./ITimeMeasurement";

export interface ITimeQuantity {
	getTotalMilliseconds(): number;
	total: ITimeMeasurement;
}
