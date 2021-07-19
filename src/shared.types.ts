import { EditorState } from "draft-js";

export interface ICustomEditorProps {}

export interface ICustomEditorState {
  editorState: EditorState;
}

export interface ICustomOptionProps {
  onChange: (editorSate: EditorState) => void;
  editorState: EditorState;
}
