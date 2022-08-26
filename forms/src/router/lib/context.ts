import type { History, Location } from "../../history";
import { Action as NavigationType } from "../../history";
import { createContext } from "../../preact/compat";

import type { RouteMatch } from "./router";

/**
 * A Navigator is a "location changer"; it's how you get to different locations.
 *
 * Every history instance conforms to the Navigator interface, but the
 * distinction is useful primarily when it comes to the low-level <Router> API
 * where both the location and a navigator must be provided separately in order
 * to avoid "tearing" that may occur in a suspense-enabled app if the action
 * and/or location were to be read directly from the history instance.
 */
export type Navigator = Pick<History, "go" | "push" | "replace" | "createHref">;

interface NavigationContextObject {
  basename: string;
  navigator: Navigator;
  static: boolean;
}

export const NavigationContext = createContext/* <NavigationContextObject> */(
  null!
);

/* if (__DEV__) {
  (NavigationContext as any).displayName = "Navigation";
} */

interface LocationContextObject {
  location: Location;
  navigationType: NavigationType;
}

export const LocationContext = createContext/* <LocationContextObject> */(
  null!
);

/* if (__DEV__) {
  (LocationContext as any).displayName = "Location";
} */

interface RouteContextObject {
  outlet: any /* React.ReactElement | null */;
  matches: RouteMatch[];
}

export const RouteContext = createContext/* <RouteContextObject> */({
  outlet: null,
  matches: [],
});

/* if (__DEV__) {
  (RouteContext as any).displayName = "Route";
} */