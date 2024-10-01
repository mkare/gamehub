import { useState, useCallback } from "react";
import { Slate, Editable, withReact } from "slate-react";
import {
  createEditor,
  Descendant,
  BaseEditor,
  Transforms,
  Editor,
  Element as SlateElement,
} from "slate";
import { withHistory, HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

const CodeElement = (props: any) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const RichContent = ({
  value = initialValue,
  onChange,
}: {
  value: Descendant[];
  onChange: (newValue: Descendant[]) => void;
}) => {
  const [editor] = useState(() =>
    withHistory(
      withReact(createEditor() as BaseEditor & ReactEditor & HistoryEditor)
    )
  );

  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  return (
    <Slate
      editor={editor}
      initialValue={value}
      onChange={(newValue) => {
        const isAstChange = editor.operations.some(
          (op: any) => op.type !== "set_selection"
        );
        if (isAstChange) {
          onChange(newValue as Descendant[]);
        }
      }}
    >
      <Editable renderElement={renderElement} />
    </Slate>
  );
};

export default RichContent;
