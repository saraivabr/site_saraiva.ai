import { Composition } from "remotion";

import { SignalStory } from "./SignalStory";

export function RemotionRoot() {
  return (
    <Composition
      id="SaraivaSignalStory"
      component={SignalStory}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={180}
      defaultProps={{
        headline: "A inteligência só importa quando muda a decisão.",
        section: "Radar",
      }}
    />
  );
}
