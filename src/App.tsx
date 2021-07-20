import React from "react";
import {
  AtomicBlockUtils,
  ContentBlock,
  convertToRaw,
  EditorBlock,
  EditorState,
  Modifier,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { StarOption } from "./StarOption/StarOption";
import { ToolbarCustomButton } from "./ToolbarCustomButton/ToolbarCustomButton";
import { ICustomEditorProps, ICustomEditorState } from "./shared.types";
import { decorator } from "./RedDivDecorator";
import { latexDecorator } from "./LatexDecorator";

import "./App.css";

const decorators = [decorator, latexDecorator];

const Component = (props: any) => {
  // const { block, contentState, blockProps } = props;
  // const data = contentState.getEntity(block.getEntityAt(0)).getData();

  // console.log(props, data, blockProps);

  return (
    <div style={{ color: "white", background: "teal", padding: 20 }}>
      <EditorBlock {...props} />
    </div>
  );
};

const blockRenderer = (contentBlock: ContentBlock) => {
  const type = contentBlock.getType();

  if (type === "atomic") {
    return {
      component: Component,
      editable: true,
      props: {
        foo: "bar",
      },
    };
  }
};

const insertLatex = (
  editorState: EditorState,
  onChange: (editorState: EditorState) => void
) => {
  const latexText = "$e^1 \\div e^2$";
  const contentState = Modifier.insertText(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    latexText
  );
  onChange(EditorState.push(editorState, contentState, "insert-characters"));
};

class App extends React.Component<ICustomEditorProps, ICustomEditorState> {
  constructor(props: any) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
    this.insert = this.insert.bind(this);
    this.insertBlock = this.insertBlock.bind(this);
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

  insertBlock = () => {
    const { editorState } = this.state;

    const contentState = editorState.getCurrentContent();

    const contentStateWithEntity = contentState.createEntity(
      "atomic",
      "IMMUTABLE",
      { a: "b" }
    );

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });

    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        " "
      ),
    });
  };

  _handleChange = (editorState: EditorState) => {
    this.setState({ editorState });
  };

  render() {
    return (
      <div>
        <div className="intert-group">
          <button
            className="insert-btn"
            type="button"
            onClick={this.insertBlock}
            style={{ background: "teal" }}
          >
            Insert Custom Block
          </button>
          <button
            className="insert-btn"
            type="button"
            onClick={this.insert}
            style={{ background: "tomato" }}
          >
            Insert Block via decorator
          </button>
          <button
            className="insert-btn"
            type="button"
            onClick={() => insertLatex(this.state.editorState, this._handleChange)}
            style={{ background: "yellow" }}
          >
            Insert Latex
          </button>
        </div>
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
            customBlockRenderFunc={blockRenderer}
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
}

export default App;
