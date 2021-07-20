import { DraftDecorator } from "draft-js";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

const latexStrategy: DraftDecorator["strategy"] = (contentBlock, callback) => {
  const LATEX_REGEX = /(\${1,2})((?:\\.|[\s\S])*)\1/g;
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = LATEX_REGEX.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
};

interface ILatexWrapperProps {
  decoratedText: string;
}

const LatexWrapper: React.FC<ILatexWrapperProps> = ({ decoratedText }) => {
  return (
    <span>
      <Latex>{decoratedText}</Latex>
    </span>
  );
};

export const latexDecorator = {
  strategy: latexStrategy,
  component: LatexWrapper,
};
