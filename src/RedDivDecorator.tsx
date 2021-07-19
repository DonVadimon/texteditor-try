import React from "react";
import { DraftDecorator } from "draft-js";

const findVariableEntities: DraftDecorator["strategy"] = (
  contentBlock,
  callback,
  contentState
) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "MY_ENTITY_TYPE"
    );
  }, callback);
};

const MyWrapper = () => <div className="my-wrapper">hello</div>;

export const decorator = {
  strategy: findVariableEntities,
  component: MyWrapper,
};
