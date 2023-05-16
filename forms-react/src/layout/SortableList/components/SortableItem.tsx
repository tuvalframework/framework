import React, { createContext, useContext, useMemo } from "react";
import type { CSSProperties, PropsWithChildren } from "react";
import type {
  DraggableSyntheticListeners,
  UniqueIdentifier
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { css } from "@emotion/css";


interface Props {
  id: UniqueIdentifier;
}

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {}
});

export function SortableItem({ children, id }: PropsWithChildren<Props>) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition
  } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef
    }),
    [attributes, listeners, setActivatorNodeRef]
  );
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition
  };

  const SortableItemClassName = css`
  & {
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
    /*align-items: center;*/
  }
`;

  return (
    <SortableItemContext.Provider value={context}>
      <div className={SortableItemClassName} ref={setNodeRef} style={style}>
        {children}
      </div>
    </SortableItemContext.Provider>
  );
}

export function DragHandle() {
  const { attributes, listeners, ref } = useContext(SortableItemContext);
    const DragHandleClassName = css`

    & {
        display: flex;
        width: 20px;
        height:30px;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        touch-action: none;
        cursor: var(--cursor, pointer);
        border-radius: 5px;
        border: none;
        outline: none;
        appearance: none;
        background-color: transparent;
        -webkit-tap-highlight-color: transparent;
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      &:focus-visible {
        box-shadow: 0 0px 0px 2px #4c9ffe;
      }

      & svg {
        flex: 0 0 auto;
        margin: auto;
        height: 100%;
        overflow: visible;
        fill: #919eab;
      }

    `
  return (
    <button className={DragHandleClassName} {...attributes} {...listeners} ref={ref}>
      <svg viewBox="0 0 20 20" width="12">
        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
      </svg>
    </button>
  );
}
