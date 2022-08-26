export namespace Hours {
	export const enum Per {
		Day = 24
	}
}

export namespace Minutes {
	export const enum Per {
		Hour = 60,
		Day = Hour * Hours.Per.Day
	}
}

export namespace Seconds {
	export const enum Per {
		Minute = 60,
		Hour = Minute * Minutes.Per.Hour,
		Day = Hour * Hours.Per.Day
	}
}

export namespace Milliseconds {
	export const enum Per {
		Second = 1000,
		Minute = Second * Seconds.Per.Minute,
		Hour = Minute * Minutes.Per.Hour,
		Day = Hour * Hours.Per.Day
	}
}

export namespace Ticks {
	export const enum Per {
		Millisecond = 10000,
		Second = Millisecond * Milliseconds.Per.Second,
		Minute = Second * Seconds.Per.Minute,
		Hour = Minute * Minutes.Per.Hour,
		Day = Hour * Hours.Per.Day
	}
}