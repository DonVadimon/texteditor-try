import React, { Component } from "react";
import { EditorState, Modifier } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ICustomOptionProps } from "../shared.types";
import "./StarOption.css";

export class StarOption extends Component<ICustomOptionProps> {
  addStar = (): void => {
    const { editorState, onChange } = this.props;
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      "⭐",
      editorState.getCurrentInlineStyle()
    );
    onChange(EditorState.push(editorState, contentState, "insert-characters"));
  };

  render() {
    return (
      <button type="button" className="custom-btn" onClick={this.addStar}>
        ⭐
      </button>
    );
  }
}
