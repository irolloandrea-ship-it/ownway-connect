import { ExploreScreen } from "./ExploreScreen";
import { DatesScreen } from "./DatesScreen";
import { StyleScreen } from "./StyleScreen";
import { ConnectingScreen } from "./ConnectingScreen";
import { WayMakersScreen } from "./WayMakersScreen";
import { MyTripsScreen } from "./MyTripsScreen";

/** Fixed design canvas every screen is authored against (scaled into the phone viewport). */
export const SCREEN_DESIGN_W = 390;
export const SCREEN_DESIGN_H = 884;

export type JourneyScreen = {
  key: string;
  label: string;
  Screen: () => React.JSX.Element;
};

export const JOURNEY_SCREENS: JourneyScreen[] = [
  { key: "explore", label: "Explore destinations", Screen: ExploreScreen },
  { key: "dates", label: "Pick travel dates", Screen: DatesScreen },
  { key: "style", label: "Travel style", Screen: StyleScreen },
  { key: "matching", label: "Finding your WayMaker", Screen: ConnectingScreen },
  { key: "suggested", label: "Suggested WayMakers", Screen: WayMakersScreen },
  { key: "journeys", label: "My Journeys", Screen: MyTripsScreen },
];

export {
  ExploreScreen,
  DatesScreen,
  StyleScreen,
  ConnectingScreen,
  WayMakersScreen,
  MyTripsScreen,
};
