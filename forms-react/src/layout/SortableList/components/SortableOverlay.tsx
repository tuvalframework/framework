import type { PropsWithChildren } from "react";
import { DragOverlay, defaultDropAnimationSideEffects } from "@dnd-kit/core";
import type { DropAnimation } from "@dnd-kit/core";
import React from "react";
import {
    createSnapModifier,
    restrictToHorizontalAxis,
    restrictToVerticalAxis,
    restrictToWindowEdges,
    snapCenterToCursor,
  } from '@dnd-kit/modifiers'

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4"
      }
    }
  })
};

interface Props {}

export function SortableOverlay({ children }: PropsWithChildren<Props>) {
  return (
    <DragOverlay  modifiers={[restrictToVerticalAxis]} dropAnimation={dropAnimationConfig}>{children}</DragOverlay>
  );
}
