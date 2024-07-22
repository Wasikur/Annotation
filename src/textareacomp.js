import React, { Component, useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js'; 
import draftToHtml from 'draftjs-to-html'; 
import { Editor } from 'react-draft-wysiwyg';

const getHtml = editorState => draftToHtml(convertToRaw(editorState.getCurrentContent())); 

function Textareacomp(props) {
  const [editorState,seteditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (editorState) => {
    seteditorState(editorState)
    props.setComment(getHtml(editorState))
  }
 
  const postComment = () => {
    seteditorState(EditorState.createEmpty())
    props.createAnnotateComments()
  }

    return (
        <div className="textarea-part">
        <Editor
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        placeholder="Enter Comment Here"
        toolbar={{
          fontSize: {
            options: [8, 9, 10, 11, 12, 14],
          },
        }}
        />
        <div className="float-right">
<button className="post-button" onClick={postComment}>Post</button>
</div>
        {/* <div className="html-view">
          {getHtml(editorState)}
        </div> */}
      
        
      </div>
    );

}

export default Textareacomp