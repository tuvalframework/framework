export interface ITimer {
	isRunning: boolean;
	start(): void;
	stop(): void;
	reset(): void;
}
