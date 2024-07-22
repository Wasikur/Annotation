import React, { useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw,convertFromRaw,ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html'; {/* new */}






function Textareacomp() {
    //const getHtml = editorState => draftToHtml(convertToRaw(editorState.getCurrentContent())); {/* new */}
  //  console.log("editor-->",EditorState.createEmpty())
   // const editorst = EditorState.createEmpty()
  // const content = {"entityMap":{},"blocks":[{"key":"637gr","text":"Initialized from content state.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
   // const [editorState1,seteditorState] = useState(convertFromRaw(content));

//  function onEditorStateChange(){
//     seteditorState(editorState1)
// }
const content = {"entityMap":{},"blocks":[{"key":"637gr","text":"Initialized from content state.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
const html = content;
const contentBlock = htmlToDraft(html);
if (contentBlock) {
  const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
  editorStateInitial = EditorState.createWithContent(contentState);
}

const [editorState, setEditorState] = React.useState(editorStateInitial);

    return (

        <div className="textarea-part">
            <Editor
            editorState={editorState}
            placeholder="Enter Comment Here"
  toolbarClassName="toolbarClassName"
  wrapperClassName="wrapperClassName"
  editorClassName="editorClassName"
  toolbar={{
    fontSize: {
      options: [8, 9, 10, 11, 12, 14],
    },
  }}
  //onEditorStateChange={onEditorStateChange}
/>
<div className="float-right">
<button className="post-button">Post</button>
<div>
{/* {getHtml(editorState1)} */}
</div>
</div>

        </div>
    )

}

export default Textareacomp