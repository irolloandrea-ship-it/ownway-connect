import type { JourneyScreen } from "../index";
import { WmLocationScreen } from "./LocationScreen";
import { WmExpertiseScreen } from "./ExpertiseScreen";
import { WmGuidanceScreen } from "./GuidanceScreen";
import { WmProfileReadyScreen } from "./ProfileReadyScreen";
import { WmRequestScreen } from "./RequestScreen";
import { WmShareWisdomScreen } from "./ShareWisdomScreen";

export const WAYMAKER_SCREENS: JourneyScreen[] = [
  { key: "wm-location", label: "Where you know best", Screen: WmLocationScreen },
  { key: "wm-expertise", label: "What you love sharing", Screen: WmExpertiseScreen },
  { key: "wm-guidance", label: "How you like to help", Screen: WmGuidanceScreen },
  { key: "wm-profile", label: "Your WayMaker profile", Screen: WmProfileReadyScreen },
  { key: "wm-request", label: "Incoming travel request", Screen: WmRequestScreen },
  { key: "wm-wisdom", label: "Share your local wisdom", Screen: WmShareWisdomScreen },
];

export {
  WmLocationScreen,
  WmExpertiseScreen,
  WmGuidanceScreen,
  WmProfileReadyScreen,
  WmRequestScreen,
  WmShareWisdomScreen,
};
