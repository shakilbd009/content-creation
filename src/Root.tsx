import { Composition } from "remotion";
import { VERTICAL_9_16, HORIZONTAL_16_9 } from "./presets/aspect-ratios";
import { SocialCodeDemo } from "./compositions/SocialCodeDemo";
import { MultiAgentShowcase } from "./compositions/MultiAgentShowcase";
import { SecurityFixesShowcase } from "./compositions/SecurityFixesShowcase";
import { KanbanSprintShowcase } from "./compositions/KanbanSprintShowcase";

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
    </>
  );
};
