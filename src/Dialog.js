import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default function Dialogpop(props) {
    return (
        <div>
            {/* onClose={handleClose}  close when clicked outside*/}
            <Dialog open={props.openPopup} aria-labelledby="form-dialog-title" className="custom-dialog">
                <DialogTitle id="form-dialog-title">
                    {props.editMode ? <span className="title">Edit Comment</span> : <span className="title">Add Comment</span>}

                    <IconButton aria-label="close" className="close-btn" onClick={props.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {
                        props.editMode ? (<textarea
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            rows="4"
                            placeholder="Edit Comment Here"
                            onChange={(e) => props.setComment(e.target.value)}
                            defaultValue={props.comment}
                        />)
                            : (<textarea
                                className="form-control"
                                id="exampleFormControlTextarea1"
                                rows="4"
                                placeholder="Type Comment Here"
                                onChange={(e) => props.setComment(e.target.value)}
                                value={props.comment}
                            />)
                    }
                </DialogContent>
                <DialogActions>
                    <div className='private-checkbox'>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={props.state}
                                    onChange={props.checkboxChange}
                                    name="checkedBox"
                                    color="primary"
                                />
                            }
                            label="Only Me"
                        />
                    </div>


                    {
                        props.editMode ? (<Button className="btn" onClick={() => props.updateAnnotateComments(props.deleteComment)}>Submit Edit</Button>)
                            : (<Button onClick={props.createAnnotateComments} className="btn"> Add </Button>)
                    }

                </DialogActions>
            </Dialog>
        </div>

    )

}