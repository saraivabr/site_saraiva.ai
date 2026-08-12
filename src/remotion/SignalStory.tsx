import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type SignalStoryProps = {
  headline: string;
  section: string;
};

export function SignalStory({ headline, section }: SignalStoryProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#F3F1EA", color: "#111315", fontFamily: "Inter, Arial, sans-serif", overflow: "hidden" }}>
      <Interactive.Div
        name="Blue signal"
        style={{
          backgroundColor: "#206FF6",
          height: 14,
          left: 0,
          position: "absolute",
          top: 0,
          width: 720,
          translate: interpolate(frame, [0, 1 * fps], ["-720px 0px", "0px 0px"], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <Interactive.Div
        name="Signal number"
        style={{
          color: "#206FF6",
          fontFamily: "monospace",
          fontSize: 26,
          fontWeight: 700,
          left: 86,
          letterSpacing: 4,
          opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          position: "absolute",
          textTransform: "uppercase",
          top: 76,
        }}
      >
        Saraiva.AI · {section}
      </Interactive.Div>
      <Interactive.Div
        name="Editorial headline"
        style={{
          fontSize: 112,
          fontWeight: 650,
          left: 86,
          letterSpacing: -8,
          lineHeight: 0.9,
          maxWidth: 1180,
          position: "absolute",
          top: 190,
          translate: interpolate(frame, [8, 1 * fps], ["0px 70px", "0px 0px"], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          opacity: interpolate(frame, [8, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        {headline}
      </Interactive.Div>
      <Interactive.Div
        name="Decision line"
        style={{
          borderTopColor: "#CFCDC5",
          borderTopStyle: "solid",
          borderTopWidth: 2,
          bottom: 88,
          fontFamily: "monospace",
          fontSize: 22,
          left: 86,
          letterSpacing: 3,
          paddingTop: 22,
          position: "absolute",
          textTransform: "uppercase",
          width: 1170,
          opacity: interpolate(frame, [1 * fps, 2 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        Sinal para quem precisa decidir
      </Interactive.Div>
      <Interactive.Div
        name="Closing field"
        style={{
          backgroundColor: "#111315",
          color: "#FFFFFF",
          display: "grid",
          fontSize: 88,
          fontWeight: 650,
          height: 1080,
          left: 0,
          letterSpacing: -6,
          placeItems: "center",
          position: "absolute",
          top: 0,
          width: 1920,
          translate: interpolate(frame, [durationInFrames - 1 * fps, durationInFrames - 1], ["0px 1080px", "0px 0px"], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        saraiva.ai
      </Interactive.Div>
    </AbsoluteFill>
  );
}
