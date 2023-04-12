import { TrackJS } from 'trackjs';

export const Tracker: any = TrackJS;


/* window.location.hash: "#2"
​
window.location.host: "localhost:4200"
​
window.location.hostname: "localhost"
​
window.location.href: "http://localhost:4200/landing?query=1#2"
​
window.location.origin: "http://localhost:4200"
​
window.location.pathname: "/landing"
​
window.location.port: "4200"
​
window.location.protocol: "http:"

window.location.search: "?query=1"
 */
 TrackJS.install({
    token: '45006292608d4c11b1cea731207c78de',
   forwardingDomain: window.location.protocol + '//' + window.location.host + "/realmocean/tracker/capture",
    console: {
        warn: false
    }
}); 


//alert(window.location.protocol + '//' +window.location.host + "/tracker/capture")



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