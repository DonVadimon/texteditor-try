import React from "react";
import { convertToRaw, EditorState, Modifier } from "draft-js";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { StarOption } from "./StarOption/StarOption";
import { ToolbarCustomButton } from "./ToolbarCustomButton/ToolbarCustomButton";
import { ICustomEditorProps, ICustomEditorState } from "./shared.types";
import { decorator } from "./RedDivDecorator";
import "./App.css";
import draftToHtml from "draftjs-to-html";

const decorators = [decorator];

class App extends React.Component<ICustomEditorProps, ICustomEditorState> {
  constructor(props: any) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
    this.insert = this.insert.bind(this);
  }
  insert() {
    const { editorState } = this.state;
    let contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const contentStateWithEntity = contentState.createEntity(
      "MY_ENTITY_TYPE",
      "IMMUTABLE"
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    contentState = Modifier.insertText(contentState, selectionState, " ");
    contentState = Modifier.insertText(
      contentState,
      selectionState,
      "hello",
      undefined,
      entityKey
    );

    let newState = EditorState.push(
      editorState,
      contentState,
      "insert-characters"
    );

    if (!newState.getCurrentContent().equals(editorState.getCurrentContent())) {
      const sel = newState.getSelection();
      const updatedSelection = sel.merge({
        anchorOffset: sel.getAnchorOffset() + 1,
        focusOffset: sel.getAnchorOffset() + 1,
      });
      // Forcing the current selection ensures that it will be at it's right place.
      newState = EditorState.forceSelection(newState, updatedSelection);
    }
    this.setState({ editorState: newState });
  }
  render() {
    return (
      <div>
        <button onClick={this.insert}>Insert div</button>
        <div className="wrapper">
          <Editor
            placeholder="Type away :)"
            editorState={this.state.editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={this._handleChange}
            customDecorators={decorators}
            toolbarCustomButtons={[
              <ToolbarCustomButton
                editorState={this.state.editorState}
                onChange={this._handleChange}
              />,
              <StarOption
                editorState={this.state.editorState}
                onChange={this._handleChange}
              />,
            ]}
          />
        </div>
        <textarea
          style={{ width: "100%", height: 300 }}
          disabled
          value={draftToHtml(
            convertToRaw(this.state.editorState.getCurrentContent())
          )}
        />
      </div>
    );
  }
  _handleChange = (editorState: EditorState) => {
    this.setState({ editorState });
  };
}

export default App;
