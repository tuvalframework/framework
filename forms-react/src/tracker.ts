import { TrackJS } from 'trackjs';

export const Tracker: any = TrackJS;

/* TrackJS.install({
    token: 'YOUR_TOKEN_HERE',
    console: {
        warn: false
    }
}); */




interface TrackerContext {

    track: (error: Error | Object | String) => void

}

export function useTracker(): TrackerContext {
    return (
        {
            track: (error: Error | Object | String) => TrackJS.track(error)
        }
    )

}