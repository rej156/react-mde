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
    const finalText = insertText(
      newText,
      `](${text.slice(
        misalignedSelectionIndex - 1,
        newSelection.end + insertionLength,
      ) || "INSERT LINK PLACEHOLDER HERE"})`,
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
