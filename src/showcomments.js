import React, { useState } from "react";
import Delete_btn from './images/Delete.svg';
import Edit_btn from './images/Edit.svg';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Button, Modal } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/LinearProgress';
import { convertToHTML } from 'draft-convert';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, ContentState,convertFromRaw } from 'draft-js';
function Showcomments(props) {

  const [toggle, setToggle] = React.useState('');
  const [editToggle, seteditToggle] = useState('');
  const [editToggleReply, seteditToggleReply] = useState('');
  const [show, setShow] = useState(false);
  const [showReplyModal, setshowReplyModal] = useState(false);
  const [showDeleteComment,setshowDeleteComment] = useState(false)
  const [updateMainComment, setupdateMainComment] = useState(EditorState.createEmpty());
  const [updateSubComment, setUpdateSubcomment] = useState(EditorState.createEmpty());
  const [updateReplyComment, setupdateReplyComment] = useState(EditorState.createEmpty());
  const [editorSubCommentState,setEditorSubCommentState] = useState(EditorState.createEmpty());
  const [replyComment, setReplyComment] = React.useState({CommentId:'',comment:'',subComment:''});
  const [deleteId, setdeleteId] = useState([]);
  const [deleteSubCommentId, setDeleteSubCommentId] = useState([]);
  
  const handleClose = () => {
    setShow(false);
    setshowReplyModal(false);
  }
  
  const showconfirm_modal = (id) => {
    setShow(true);
    let arrDeleteId = [];
    arrDeleteId.push(id)
    setdeleteId(arrDeleteId)
  }
  const showReplyconfirm_modal = (id) => {
    setshowReplyModal(true);
    let arrDeleteId = [];
    arrDeleteId.push(id)
    setdeleteId(arrDeleteId)
  }

  const accordian = (id) => {
    if(toggle != id) {
      setToggle(id);
    }
    else {
      setToggle('');
    }
   
  }

  const RenderHTML = (props) => (<span dangerouslySetInnerHTML={{ __html: props.HTML }}></span>)
  const getHtml = editorState => draftToHtml(convertToRaw(editorState.getCurrentContent()));

  const showcomment_textbox = (cmp, id) => {
    seteditToggle(id)
    const html = cmp;
    const contentBlock = typeof window !== 'undefined' ? htmlToDraft(html) : null;
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
              const editorState = EditorState.createWithContent(contentState);
              setupdateMainComment(editorState)
            }
  }


  const showreply_textbox = () => {
    seteditToggleReply('')
  }

  const hidecomment_textbox = () => {
    seteditToggle('')
  }

  const onEditorStateChange = (editorState) => {
    setupdateMainComment(editorState)
    props.setComment(getHtml(editorState))
  }

  const handleMainCheckBox = (id) => {
   
    let arrDeleteId = [...deleteId];
    if(arrDeleteId.indexOf(id) < 0 ){
      arrDeleteId.push(id)
     
    }
    else {
      arrDeleteId.splice(arrDeleteId.indexOf(id),1)
    }
    console.log("deleted id",arrDeleteId)
    setdeleteId(arrDeleteId);
  }

  const handleSubCommentCheckBox = (id) => {
    let arrDeleteId = [...deleteSubCommentId];
    arrDeleteId.push(id);
    setDeleteSubCommentId(arrDeleteId)
  }

  
  
 /*code for subcomment*/

 

 const onSubCommentEditorStateChange = (editorState) => {
  setEditorSubCommentState(editorState);
  let showSubComment = getHtml(editorState);
  let subcomment = {...replyComment,subComment:showSubComment}
   props.setSubComment(subcomment)
 }

 const replySubcomment = (id,comment) => {
  let subcomment = {CommentId:id,comment:comment,subComment:''}
  setReplyComment(subcomment)
 }

 const showReply_textbox = (cmp, id) => {
  seteditToggleReply(id)
  const html = cmp;
  const contentBlock = typeof window !== 'undefined' ? htmlToDraft(html) : null;
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setupdateReplyComment(editorState)
          }
          //let subcomment = {CommentId:id,comment:comment,subComment:''}
         // setReplyComment(subcomment)
}
const onEditorReplyStateChange = (editorState) => {
  setupdateReplyComment(editorState)
  let showSubComment = getHtml(editorState);
  let subcomment = {...replyComment,subComment:showSubComment}
  props.setSubComment(subcomment)
}
React.useEffect(() => {
  if(props.comments.comments.length > 0) {
    let subcomment = {CommentId:props.comments.comments[0].id,comment:'',subComment:''}
    setReplyComment(subcomment)
  }
 
}, [props.comments.comments]);

const postSubComment = () => {
  setEditorSubCommentState(EditorState.createEmpty())
  props.createAnnotateSubComments()
}
const clearSubComment = () => {
  setEditorSubCommentState(EditorState.createEmpty())
  //props.createAnnotateSubComments()
}

  return (
    <div className="all_comment_section">
      <Modal show={show} onHide={handleClose} animation={true} aria-labelledby="contained-modal-title-vcenter"
        centered>
         <Modal.Body className="text-center">Are you sure want to Delete?</Modal.Body>
        <Modal.Footer>
        {
            deleteId.length > 0 ? ( <Button variant="secondary" onClick={() => { props.multiDeleteAnnotateComments(deleteId,deleteSubCommentId); handleClose();setdeleteId([]);setDeleteSubCommentId([]) }}>
            Confirm
          </Button>) : ''
        }
         
          <Button variant="primary" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showReplyModal} onHide={handleClose} animation={true} aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Body className="text-center">Are you sure want to Delete?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { props.deleteAnnotateSubComments(deleteId); handleClose() }}>
            Confirm
          </Button>
          <Button variant="primary" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={props.showDelPop} onHide={props.cancelmultidelPop} animation={true} aria-labelledby="contained-modal-title-vcenter"
        centered>
          {
            deleteId.length > 0 ? (<Modal.Body className="text-center">Are you sure want to Delete</Modal.Body>) : (<Modal.Body className="text-center"> Please Select Comment to Delete</Modal.Body>)
          }
        <Modal.Footer>
        {
            deleteId.length > 0 ? ( <Button variant="secondary" onClick={() => { props.multiDeleteAnnotateComments(deleteId,deleteSubCommentId); props.cancelmultidelPop();setdeleteId([]);setDeleteSubCommentId([]) }}>
            Confirm
          </Button>) : ''
        }
         
          <Button variant="primary" onClick={() => props.cancelmultidelPop()}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      
      <div>
        {
          props.comments.comments.length > 0 ? props.comments.comments.map((cmp) => (
            <div key={cmp.id} className="main_c_separator">
              <section>
                <div className="row rel-pos">
                  <div className="col-sm-1 checkbox-area chkbx-section"> 
                  {props.userName == cmp.userName ?  <input type="checkbox" onChange={() => handleMainCheckBox(cmp.id)} /> :  <input type="checkbox" onChange={() => handleMainCheckBox(cmp.id)} disabled/>}
                  
                  </div>
                  {<div className={editToggle != cmp.id || editToggle == '' ? 'show col-sm-10 comment cmnt-section' : 'hide'} > <RenderHTML HTML={cmp.comments} />  </div>}
                  {
                    editToggle == cmp.id &&
                   ( <div className={editToggle == cmp.id ? "col-sm-11 show edit-main-section" : "col-sm-10 hide"}>
                      <div className="textarea-part main-comment-reply mt-0">
                        <Editor
                          placeholder="Enter Comment Here"
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          editorState={updateMainComment}
                          onEditorStateChange={onEditorStateChange}
                          toolbar={{
                            fontSize: {
                              options: [8, 9, 10, 11, 12, 14],
                            },
                          }}
                        />
                      </div>
                    </div>)
                  }


                  <div className={editToggle == cmp.id ? "absolute-button" : "col-sm-1 text-right main-cmt-btns-section"}>
                 {props.userName == cmp.userName ? <span > {editToggle != cmp.id || editToggle == '' ? <img src={Edit_btn} onClick={() => showcomment_textbox(cmp.comments, cmp.id)} /> : <button onClick={() => { props.updateAnnotateComments(cmp.id); seteditToggle('') }} className="complete_btn">  </button>} </span> : '' }      
                 {props.userName == cmp.userName ? <span className="delete_comment"> {editToggle != cmp.id || editToggle == '' ? <img src={Delete_btn} title="Delete" onClick={() => { showconfirm_modal(cmp.id) }} /> : <button onClick={hidecomment_textbox} className="cross_btn">  </button>}</span>: ''}    
                  </div>
                </div>

                {
                  <div className={editToggle != cmp.id ? "row comments-info show"
                    : 'hide'}>
                    <div className="col-sm-1 chkbx-section">  </div>
                    <div className="col-sm-6 italic-font byuser-section"> by {cmp.userName} on {cmp.modifiedAt == null ? new Date(cmp.createdAt).toLocaleDateString(undefined, {year: 'numeric', month: 'short',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}) : new Date(cmp.modifiedAt).toLocaleDateString(undefined, {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})}</div>
                    <div className="col-sm-5 italic-font text-right bydate-section">
                {new Date().toTimeString().slice(9)}{Intl.DateTimeFormat().resolvedOptions().timeZone}
                    </div>
                  </div>
                }


              </section>


              { editToggle != cmp.id && <div className="row">
         <div className="col-sm-1 chkbx-section"> </div>
        <div className="col-sm-11 main-cmt-section">
          <button className= {replyComment.CommentId == cmp.id ? "reply-btn hide": "reply-btn show"}  onClick={() => replySubcomment(cmp.id, cmp.comments)}>Reply </button>
   {replyComment.CommentId == cmp.id && <div className={replyComment.CommentId == cmp.id ? "textarea-part main-comment-reply show":"textarea-part main-comment-reply hide"}>
             <Editor
               placeholder="Reply Here"
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              editorState={editorSubCommentState}
              onEditorStateChange={onSubCommentEditorStateChange}
              toolbar={{
                fontSize: {
                  options: [8, 9, 10, 11, 12, 14],
                },
              }}
             />
              {/* editorState={editorSubCommentState}    onBlur={clearSubComment}*/}
            <div className="float-right">
               <button className="post-button" onClick={postSubComment}>Post</button>
             </div>
           </div>}
         

         </div>
           
       </div>
     }  


              <div className="row comnrep">
              <div className="col-sm-1 chkbx-section"></div>
        <div className="col-sm-5 cmntreply-section"> Comments/Replies ({cmp.subCommentsData.length})</div>
        <div className="col-sm-6 text-right tgl-section">
          <button onClick={() => accordian(cmp.id)} className={toggle == cmp.id ? "accordian-btn arrow-up":"accordian-btn arrow-down"}>{toggle == cmp.id ? 'Hide' : 'Show'}</button>

        </div>

      </div>
           <div className= { toggle == cmp.id ? 'replySection show' : 'replySection hide'}>
              {
                 

                  cmp.subCommentsData.length > 0 ?  cmp.subCommentsData.map((subcmp) => (
                  <div className="row mr-lr0" key={subcmp.id}>
                   <div className="col-sm-1 chkbx-section"></div>
                    <section className="col-sm-11 reply-section">
              <div className="row rel-pos">
                
                <div className="col-sm-1 checkbox-area subcomment-chbx-section">
                {props.userName == subcmp.userName ?  <input type="checkbox" onChange={() => handleSubCommentCheckBox(subcmp.id)}/> :  <input type="checkbox" onChange={() => handleSubCommentCheckBox(subcmp.id)} disabled/>}
                  
                    </div>
                {
                  // {getSubcommentHtml(editorSubCommentState)}
                  editToggleReply !== subcmp.id || editToggleReply == '' ? <div className="col-sm-10 comment subcomment-comment-section"> <RenderHTML HTML={subcmp.subComment} /></div> :
                    (<div className={editToggleReply== subcmp.id ? "col-sm-11 main-comment-reply-section" : "col-sm-10"}>
                      <div className="textarea-part main-comment-reply mt-0">
                        <Editor
                          placeholder="Enter Comment Here"
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          editorState={updateReplyComment}
                          onEditorStateChange={onEditorReplyStateChange}
                          toolbar={{
                            fontSize: {
                              options: [8, 9, 10, 11, 12, 14],
                            },
                          }}
                        />
                      </div>
                    </div>)} 
                    {/* <div className="col-sm-1 text-right"> 
                               <span> <img src ={Edit_btn}/> </span>
                               <span className="delete_comment"> <img src ={Delete_btn}/> </span>
                               </div> */}

                    <div className={editToggleReply == subcmp.id ? "absolute-button" : "col-sm-1 text-right subcomment-button-section"}>
                    {props.userName == subcmp.userName ?  <span > {editToggleReply != subcmp.id ? <img src={Edit_btn} title="Edit"  onClick={() => showReply_textbox(subcmp.subComment,subcmp.id)}/> : <button className="complete_btn" onClick={() => {props.updateAnnotateSubComments(subcmp.id);seteditToggleReply('')}} >  </button>} </span>: ''}    
                    {props.userName == subcmp.userName ? <span className="delete_comment"> {editToggleReply != subcmp.id ? <img src={Delete_btn} title="Delete" title="Delete" onClick={() => showReplyconfirm_modal(subcmp.id)} /> : <button onClick={showreply_textbox} className="cross_btn">  </button>}</span>: ''}
                </div>
              </div>

                     {editToggleReply != subcmp.id && <div className="row comments-info">
                <div className="col-sm-1 chkbx-section">  </div>
                <div className="col-sm-6 italic-font byuser-subcomment-section"> by {subcmp.userName} on {subcmp.modifiedAt == null ? new Date(subcmp.createdAt).toLocaleDateString(undefined, {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}) : new Date(subcmp.modifiedAt).toLocaleDateString(undefined, {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})}</div>
                 <div className="col-sm-5 italic-font text-right bydate-subcomment-section">
                 {new Date().toTimeString().slice(9)}{Intl.DateTimeFormat().resolvedOptions().timeZone}
                </div> 
              </div>}

            </section>
                  </div>
                  
                  )) : ''

                
              }
             </div>
            </div>
          ))

            : props.comments.loading ? <span><CircularProgress /></span> : <h2> No Comments</h2>}

      </div>
    </div>
  )
}

export default Showcomments