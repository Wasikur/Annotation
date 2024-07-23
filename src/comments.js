import React, { useEffect } from "react";
import "./comments.css";
import { Typography, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import Customtheme from "./custometheme";
import Dialogpop from "./Dialog";
import axios from "axios";
import CircularProgress from "@material-ui/core/LinearProgress";
import { Alert } from "@material-ui/lab";
import Textareacomp from "./textareacomp";
import Writeback_White from "./images/Writeback_White.svg";
import delete_icon from "./images/delete_icon.svg";
import close_popupbtn from "./images/Collapse.svg";
// import more_icon from "./images/more.svg";
import Showcomments from "./showcomments";
// import { Resizable, ResizableBox } from "react-resizable";
// import Draggable, { DraggableCore } from "react-draggable";
import { Rnd } from "react-rnd";

export default function Comment(props) {
  const [openPopup, setopenPopup] = React.useState(false);
  const [editMode, seteditMode] = React.useState(false);
  const [comments, setcomments] = React.useState({
    loading: true,
    comments: [],
  });
  const [comment, setComment] = React.useState("");
  const [subComment, setSubComment] = React.useState({
    CommentId: "",
    comment: "",
    subComment: "",
  });
  const [deleteComment, setdeleteComment] = React.useState(null);
  const [state, setState] = React.useState(false);
  const [commentId, setcommentId] = React.useState(null);
  const [modalPop, setmodalPop] = React.useState(false);
  const [showDelPop, setShowDelPop] = React.useState(false);
  const [userSessionInfo, setuserSessionInfo] = React.useState({
    id: "",
    lastLogin: "",
    name: "",
    siteRole: "",
    token: "",
  });
  const [reSize, setResize] = React.useState({ width: 1483, height: 500 });
  const onResize = (event, { element, size, handle }) => {
    setResize({ width: size.width, height: size.height });
  };

  let tableauBaseUrl = "";
  let tableauWorkBook = "";
  let siteName = "";
  let match;
  try {
    const referrer = document.referrer;
    let reg =
      /(http:\/\/.*?\/|https:\/\/.*?\/)(.*)(\/)?(views|authoring)(\/)(.*)\/.*/;
    match = reg.exec(referrer);
    console.log("match-->", match);
    if (match) {
      if (match[1]) {
        tableauBaseUrl = match[1];
      }
      if (match[2]) {
        if (match[2][match[2].length - 1] === "/") {
          match[2] = match[2].slice(0, -1);
        }
        siteName = match[2].split("/").pop();
      }
      if (match[6]) {
        tableauWorkBook = match[6];
      }
    }
  } catch (e) {
    console.log("Failed to parse workbook URL", e);
  }
  if (siteName == "") {
    siteName = "Default";
  }
  console.log(
    "Tableau URL, Site, Workbook: ",
    match,
    tableauBaseUrl,
    siteName,
    tableauWorkBook
  );
  console.log("match==>", match);
  console.log("tableauBaseUrl==>", tableauBaseUrl);
  console.log("tableauWorkBook==>", tableauWorkBook);

  const checkboxChange = (event) => {
    setState(event.target.checked);
    console.log("checkbox", state);
  };

  /*axios start*/
  const api = axios.create({
    // baseURL: window.location.origin,
    // baseURL: window.location.origin + "/annotation/annotate/comments/", // for server
    baseURL: "http://localhost:8080/annotate/comments/", // for local testing
    headers: {
      // Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${userSessionInfo.token}`,
    },
  });
  // Updated part- This ensures that the header is set correctly whenever the token updates. Token is updated dynamically.
  // useEffect(() => {
  //   if (userSessionInfo.token) {
  //     api.defaults.headers.common[
  //       "Authorization"
  //     ] = `Bearer ${userSessionInfo.token}`;
  //   }
  // }, [userSessionInfo.token]);

  const requestOptions = {
    comments: comment,
    isPrivate: state,
    isPrivater: true,
    siteName: siteName,
    tableauServer: tableauBaseUrl,
    userName: props.username,
    workbookName: tableauWorkBook,
  };
  const requestOptionsSubComment = {
    comments: subComment.comment,
    isPrivate: state,
    isPrivater: true,
    siteName: siteName,
    tableauServer: tableauBaseUrl,
    userName: props.username,
    workbookName: tableauWorkBook,
    subComment: subComment.subComment,
  };

  const userReq = {
    server: tableauBaseUrl,
    siteName: siteName,
    username: props.username,
    viewURL: tableauWorkBook,
  };

  React.useEffect(() => {
    console.log("userReq.username", userReq.username);
    if (userReq.username !== undefined || userReq.username !== null) {
      getUserInfo();
    }
  }, [props.username]);

  const getAnnotateComments = (token) => {
    try {
      api
        .get("/getComments", {
          params: {
            siteName: siteName,
            workbookName: tableauWorkBook,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("getcommentsall-->", response.data);
          const allComments = response.data.annotateComments;
          let saveComments = { loading: false, comments: allComments };
          setcomments(saveComments);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getUserInfo = () => {
    try {
      api.post("/user-info", JSON.stringify(userReq)).then((response) => {
        setuserSessionInfo(response.data);
        getAnnotateComments(response.data.token);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createAnnotateComments = () => {
    try {
      api
        .post("/save", JSON.stringify(requestOptions), {
          headers: {
            Authorization: `Bearer ${userSessionInfo.token}`,
          },
        })
        .then((response) => {
          setComment("");
          getAnnotateComments(userSessionInfo.token);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const createAnnotateSubComments = () => {
    try {
      api
        .post(
          `/savesubcomment/${subComment.CommentId}`,
          JSON.stringify(requestOptionsSubComment),
          {
            headers: {
              Authorization: `Bearer ${userSessionInfo.token}`,
            },
          }
        )
        .then((response) => {
          setSubComment("");
          // setcomments([...comments].concat(requestOptions));
          //setopenPopup(false);
          getAnnotateComments(userSessionInfo.token);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAnnotateComments = (id) => {
    try {
      api
        .delete(`/${id}`, {
          headers: {
            Authorization: `Bearer ${userSessionInfo.token}`,
          },
        })
        .then((response) => {
          getAnnotateComments(userSessionInfo.token);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const multiDeleteAnnotateComments = (id, subcommentid) => {
    try {
      const requestOptionsdelete = {
        commentIds: id,
        subCommentIds: subcommentid,
        userName: props.username,
      };
      // console.log("del-->",requestOptionsdelete)
      api
        .delete(
          `/multipleDelete`,
          { data: requestOptionsdelete },
          {
            headers: {
              Authorization: `Bearer ${userSessionInfo.token}`,
            },
          }
        )
        .then(() => {
          getAnnotateComments(userSessionInfo.token);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAnnotateSubComments = (id) => {
    try {
      api
        .delete(`subcomment/${id}`, {
          headers: {
            Authorization: `Bearer ${userSessionInfo.token}`,
          },
        })
        .then(() => {
          getAnnotateComments(userSessionInfo.token);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateAnnotateComments = (id) => {
    try {
      api
        .post(`/update/${id}`, JSON.stringify(requestOptions), {
          headers: {
            Authorization: `Bearer ${userSessionInfo.token}`,
          },
        })
        .then(() => {
          getAnnotateComments(userSessionInfo.token);
          setopenPopup(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const updateAnnotateSubComments = (id) => {
    try {
      api
        .post(
          `/updatesubcomment/${id}`,
          JSON.stringify(requestOptionsSubComment),
          {
            headers: {
              Authorization: `Bearer ${userSessionInfo.token}`,
            },
          }
        )
        .then(() => {
          getAnnotateComments(userSessionInfo.token);
          setopenPopup(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  /*axios end*/

  const addpopOpen = (e) => {
    setComment("");
    setopenPopup(true);
    seteditMode(false);
  };

  const editClick = () => {
    setopenPopup(true);
    seteditMode(true);
  };
  const CommentsClicked = (ev) => {
    setdeleteComment(
      commentId == `${ev.currentTarget.dataset.div_id}`
        ? ""
        : `${ev.currentTarget.dataset.div_id}`
    );
    setComment(
      commentId == `${ev.currentTarget.dataset.div_id}`
        ? ""
        : `${ev.currentTarget.textContent}`
    );
    setcommentId(
      commentId == `${ev.currentTarget.dataset.div_id}`
        ? ""
        : `${ev.currentTarget.dataset.div_id}`
    );
  };
  const handleClose = () => {
    setopenPopup(false);
  };

  const modalPopup = () => {
    setmodalPop(!modalPop);
  };

  const cancelmultidelPop = () => {
    setShowDelPop(false);
  };

  return (
    <div>
      <div className="text-right">
        <span className="click_icons float-right" onClick={modalPopup}>
          {" "}
        </span>
      </div>
      <Rnd
        default={{
          x: 20,
          y: 55,
        }}
        minWidth={800}
        bounds="window"
        disableDragging="true"
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        }}
      >
        {/* <ResizableBox className={ modalPop ? 'showPopup' : 'hidePopup'}  height={reSize.height} width={reSize.width} onResize={onResize} >
           <div  style={{width: reSize.width + 'px', height: reSize.height + 'px'}}> */}

        <div className={modalPop ? "showPopup" : "hidePopup"}>
          <div className="comments-topbar">
            <Grid
              justifyContent="space-between"
              container
              className="top-section"
            >
              <div className="float-left">
                <div className="row">
                  <div className="col-sm">
                    {" "}
                    <img
                      src={Writeback_White}
                      className="cursor-pointer"
                    ></img>{" "}
                  </div>
                  {/* <div className="col-sm">  Auto Saved</div> */}
                </div>
              </div>

              <div className="float-right">
                <div className="row">
                  <div className="col-sm">
                    <img
                      src={delete_icon}
                      className="cursor-pointer"
                      onClick={() => setShowDelPop(true)}
                    ></img>
                  </div>
                  {/* <div className="col-sm">
                        <img src = {more_icon} className="cursor-pointer"></img>
                        </div> */}
                  <div className="col-sm">
                    <img
                      src={close_popupbtn}
                      className="cursor-pointer"
                      onClick={modalPopup}
                    ></img>
                  </div>
                </div>
              </div>
              {/* <Grid item >
                        <Typography type="title" color="inherit">
                            <span className='refresh-icons'><AutorenewIcon /></span>   Comments
                        </Typography>
                    </Grid>

                    <Grid item>
                        <div className='topBar-set'>
                            <AddIcon title='Add' onClick={addpopOpen} />
                            <EditIcon onClick={editClick}   title='Edit'/>
                            <DeleteForeverIcon onClick={() => deleteAnnotateComments(deleteComment)}  title='Delete'/>
                           <Customtheme ></Customtheme>
                        </div>
                    </Grid> */}
            </Grid>
          </div>
          <div className="comments-section">
            <Textareacomp
              createAnnotateComments={createAnnotateComments}
              setComment={setComment}
            ></Textareacomp>

            <Showcomments
              comments={comments}
              setComment={setComment}
              deleteAnnotateComments={deleteAnnotateComments}
              updateAnnotateComments={updateAnnotateComments}
              createAnnotateSubComments={createAnnotateSubComments}
              setSubComment={setSubComment}
              updateAnnotateSubComments={updateAnnotateSubComments}
              deleteAnnotateSubComments={deleteAnnotateSubComments}
              showDelPop={showDelPop}
              cancelmultidelPop={cancelmultidelPop}
              multiDeleteAnnotateComments={multiDeleteAnnotateComments}
              userName={props.username}
            ></Showcomments>

            {/* {comments.comments.length > 0 ?
                    (comments.comments.map((comment) => (
                        <div key={comment.id}>
                            <div data-div_id={comment.id}
                                className={comment.id == commentId ? 'selected-comment' : 'comments-list'}
                                onClick={CommentsClicked}>{comment.comments}</div>
                        </div>
                    )))
                    : comments.loading ?  <span><CircularProgress /></span> : <h2> No Comments</h2>} */}
          </div>
          <Dialogpop
            openPopup={openPopup}
            editMode={editMode}
            handleClose={handleClose}
            comment={comment}
            setComment={setComment}
            updateAnnotateComments={updateAnnotateComments}
            deleteComment={deleteComment}
            createAnnotateComments={createAnnotateComments}
            checkboxChange={checkboxChange}
            state={state}
          ></Dialogpop>
        </div>

        {/* </ResizableBox > */}
      </Rnd>
    </div>
  );
}
