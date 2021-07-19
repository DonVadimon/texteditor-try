import React from "react";
import { EditorState, Modifier, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import htmlToDraft from "html-to-draftjs";
import "./ToolbarCustomButton.css";
import { ICustomOptionProps } from "../shared.types";

export const ToolbarCustomButton: React.FC<ICustomOptionProps> = ({
  editorState,
  onChange,
}) => {
  const addBlueRect = () => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const html = `<p><h3 style="background: teal; color: white;">Dear member!</h3><p>This is a <b>${currentContent
      .getPlainText()
      .slice(
        selection.getStartOffset(),
        selection.getEndOffset()
      )}</b></p><img style="height: 100px;" src="https://sun9-37.userapi.com/impf/c846523/v846523943/1a9e5d/fWocEUzzWV4.jpg?size=797x598&quality=96&sign=08bfcb39308a6fdda4b304f3f0155b6e&type=album"></p>`;
    const { contentBlocks, entityMap } = htmlToDraft(html);

    const contentState = Modifier.replaceWithFragment(
      currentContent,
      selection,
      ContentState.createFromBlockArray(contentBlocks, entityMap).getBlockMap()
    );
    onChange(EditorState.push(editorState, contentState, "insert-characters"));
  };

  return (
    <button type="button" className="custom-btn" onClick={addBlueRect}>
      Blue Rect
    </button>
  );
};
