/**
 * Convert Text to wysiwyg format
 */
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { EditorState, convertToRaw, ContentState } from "draft-js";

class EditorUtils {
  stringToRaw = ({ value = "" }) => {
    let contentBlock = htmlToDraft(value);
    if (contentBlock) {
      let contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      let editorState = EditorState.createWithContent(contentState);
      return editorState;
    }
  };

  rawToString = ({ value = "" }) => {
    return draftToHtml(convertToRaw(value.getCurrentContent()));
  };
}

export default new EditorUtils();
