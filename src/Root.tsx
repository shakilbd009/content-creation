import { Composition } from "remotion";
import { VERTICAL_9_16, HORIZONTAL_16_9 } from "./presets/aspect-ratios";
import { SocialCodeDemo } from "./compositions/SocialCodeDemo";
import { MultiAgentShowcase } from "./compositions/MultiAgentShowcase";
import { SecurityFixesShowcase } from "./compositions/SecurityFixesShowcase";
import { KanbanSprintShowcase } from "./compositions/KanbanSprintShowcase";
import { OpenClawShowcase } from "./compositions/OpenClawShowcase";
import { CodeReviewShowcase } from "./compositions/CodeReviewShowcase";
import { AWSLandingZoneShowcase } from "./compositions/AWSLandingZoneShowcase";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SocialCodeDemo"
        component={SocialCodeDemo}
        durationInFrames={240}
        fps={30}
        {...VERTICAL_9_16}
      />
      <Composition
        id="MultiAgentShowcase"
        component={MultiAgentShowcase}
        durationInFrames={540}
        fps={30}
        {...HORIZONTAL_16_9}
      />
      <Composition
        id="SecurityFixesShowcase"
        component={SecurityFixesShowcase}
        durationInFrames={660}
        fps={30}
        {...HORIZONTAL_16_9}
      />
      <Composition
        id="KanbanSprintShowcase"
        component={KanbanSprintShowcase}
        durationInFrames={600}
        fps={30}
        {...HORIZONTAL_16_9}
      />
      <Composition
        id="OpenClawShowcase"
        component={OpenClawShowcase}
        durationInFrames={600}
        fps={30}
        {...HORIZONTAL_16_9}
      />
      <Composition
        id="CodeReviewShowcase"
        component={CodeReviewShowcase}
        durationInFrames={750}
        fps={30}
        {...HORIZONTAL_16_9}
      />
      <Composition
        id="AWSLandingZoneShowcase"
        component={AWSLandingZoneShowcase}
        durationInFrames={540}
        fps={30}
        {...HORIZONTAL_16_9}
      />
    </>
  );
};
