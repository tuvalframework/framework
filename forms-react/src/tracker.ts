import { TrackJS } from 'trackjs';

export const Tracker: any = TrackJS;
debugger

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
    token: '36b9a7b6c9634aa5a009b061da931cd9',
   // forwardingDomain: window.location.protocol + '//' + window.location.host + "/tracker/capture",
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