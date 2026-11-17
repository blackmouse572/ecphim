import { Button } from "@repo/design-system/components/ui/button";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * The older `components/ui/button` (react-aria), still used across the app
 * while pages migrate to `components/base`. Its variants are re-skinned to
 * the redesign so both buttons look the same.
 */
const meta = {
  title: "ecphim/Legacy button",
  parameters: { themes: { themeOverride: "dark" } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const INTENTS = [
  "primary",
  "secondary",
  "outline",
  "plain",
  "danger",
  "warning",
] as const;

export const Intents: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-8">
      {INTENTS.map((intent) => (
        <Button intent={intent} key={intent}>
          {intent}
        </Button>
      ))}
    </div>
  ),
};
