import * as React from "react";
import { Command } from "../types";
import { insertText, selectWordIfCaretIsInsideOne } from "../util/MarkdownUtil";
import {
  buildNewDraftState,
  getMarkdownStateFromDraftState,
} from "../util/DraftUtil";
import { MdeToolbarIcon } from "../components";

export const linkCommand: Command = {
  buttonContent: <MdeToolbarIcon icon="link" />,

  buttonProps: { "aria-label": "Insert a link" },

  execute: (state) => {
    const { text, selection } = getMarkdownStateFromDraftState(state);
    const newSelection = selectWordIfCaretIsInsideOne({ text, selection });
    const { newText, insertionLength } = insertText(
      text,
      "[",
      newSelection.start,
    );
    const misalignedSelectionIndex = newSelection.start + insertionLength;
    let originalSelectedText: string = text.slice(
      misalignedSelectionIndex - 1,
      newSelection.end + insertionLength,
    );

    originalSelectedText =
      originalSelectedText.slice(-1) === " "
        ? originalSelectedText.slice(0, -1)
        : originalSelectedText;
    const finalText = insertText(
      newText,
      `](${originalSelectedText || "INSERT LINK PLACEHOLDER HERE"})`,
      newSelection.end + insertionLength,
    ).newText;

    return buildNewDraftState(state, {
      text: finalText,
      selection: {
        start: newSelection.start + insertionLength,
        end: newSelection.end + insertionLength,
      },
    });
  },
};
