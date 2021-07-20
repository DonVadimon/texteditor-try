import React, { Fragment } from "react";
import {
  // Editor,
  EditorState,
  EditorBlock,
  AtomicBlockUtils,
  ContentBlock,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ICustomEditorProps, ICustomEditorState } from "./shared.types";

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

class App extends React.Component<ICustomEditorProps, ICustomEditorState> {
  constructor(props: any) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }
  
  render() {
    const { editorState } = this.state;
    
    return (
      <Fragment>
        <button onClick={() => this.insertBlock()}>Insert block</button>
        <Editor
          editorState={editorState}
          // onChange={this.onChange}
          // blockRendererFn={blockRenderer}
          onEditorStateChange={this.onChange}
          customBlockRenderFunc={blockRenderer}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          />
      </Fragment>
    );
  }
  
  onChange = (editorState: EditorState) => {
    this.setState({ editorState });
  }

  insertBlock = () => {
    const { editorState } = this.state;

    const contentState = editorState.getCurrentContent();

    const contentStateWithEntity = contentState.createEntity(
      'atomic',
      "MUTABLE",
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
  }
}

export default App;
