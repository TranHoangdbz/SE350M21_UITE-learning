import React, {useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Avatar } from '@mui/material'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import URL_API from '../../../services/API/config';
import AjaxHelper from '../../../services/index';
import {setCurrentCourse} from '../courseLearningSlice.js';
import ReplyCommentCard from './ReplyCommentCard';
import { FiMoreHorizontal } from "react-icons/fi";
import { MdThumbUp } from "react-icons/md";

function CommentCard(props) {
    // console.log("commentProps", props.comment);
    const dispatch = useDispatch();
    const calculateTime = (timeString) => {
        const postTime = new Date(timeString);
        var diff = Math.abs(new Date() - postTime);
        if(diff<1000*60){
            return ("0 minutes ago");
        }
        else if(diff<1000*60*60){
            return (Math.floor(diff/1000/60) +" minutes ago");
        }
        else if(diff<1000*60*60*24){
            return(Math.floor(diff/1000/60/60) +" hours ago");
        }
        else if(diff<1000*60*60*24*30) {
            return(Math.floor(diff/1000/60/60/24) +" days ago");
        }
        else if(diff<1000*60*60*24*365) {
            return(Math.floor(diff/1000/60/60/24/30) +" months ago");
        }
        else{
            return (Math.floor(diff/1000/60/60/24/365) +" years ago")
        }
    }
    
    const [displayAnswer, setDisplayAnswer] = useState(false);
    // console.log("props.comment.comment", props.comment.comment);
    const currentCourse = useSelector((state) => {return state.courseLearning.currentCourse});
    const currentUserInfo = useSelector((state) => {return state.courseLearning.currentUserInfo});
    const cmtContentRef = useRef(null);

    const addNewComment = async() => {
        var dataToAdd = {
            parrentCommentID: props.comment.comment._id,
            content: cmtContentRef.current.value,
            userID: currentUserInfo._id,
            courseID: currentCourse._id
        }
        console.log("dataToAdd", dataToAdd);

        await AjaxHelper.post(URL_API.URL_SYSTEM_V1 + '/discussions/comment/', dataToAdd)
            .then(res => {
                dispatch(setCurrentCourse(res.data.currentCourse));
                cmtContentRef.current.value="";
                setDisplayAnswer(false);
            })
            .catch(err => {
            })
    }

    const [isOpenManage, setIsOpenManage] = useState(false);

    const deleteComment = async() => {
        var dataToDelete = {
            parrentCommentID : "",
            commentID: props.comment.comment._id,
            courseID: currentCourse._id
        }
        // console.log("dataToDelete", dataToDelete);
        await AjaxHelper.post(URL_API.URL_SYSTEM_V1 + '/discussions/comment/delete', dataToDelete)
            .then(res => {
                dispatch(setCurrentCourse(res.data.currentCourse));
                // cmtContentRef.current.value="";
                // setDisplayAnswer(false);
                setIsOpenManage(false);
            })
            .catch(err => {
            })
    }

    const likeComment = async() => {
        var dataToLike = {
            commentID: props.comment.comment._id,
            courseID: currentCourse._id,
            userID: currentUserInfo._id,
            parrentCommentID: "",
        }
        // console.log("dataToLike", dataToLike);

        await AjaxHelper.post(URL_API.URL_SYSTEM_V1 + '/discussions/comment/like', dataToLike)
        .then(res => {
            dispatch(setCurrentCourse(res.data.currentCourse));
            // cmtContentRef.current.value="";
            // setDisplayAnswer(false);
        })
        .catch(err => {
        })
    }

    const unlikeComment = async() => {
        var dataToUnLike = {
            commentID: props.comment.comment._id,
            courseID: currentCourse._id,
            userID: currentUserInfo._id,
            parrentCommentID: "",
        }
        // console.log("dataToLike", dataToLike);

        await AjaxHelper.post(URL_API.URL_SYSTEM_V1 + '/discussions/comment/dislike', dataToUnLike)
        .then(res => {
            dispatch(setCurrentCourse(res.data.currentCourse));
            // cmtContentRef.current.value="";
            // setDisplayAnswer(false);
        })
        .catch(err => {
        })
    }

    // Edit comment
    const [isEditDocument, setIsEditDocument] = useState(false);

    const toEditComment = async() => {
        setIsEditDocument(true);
        setIsOpenManage(false);
    }

    const cancelEdit = async() => {
        setIsEditDocument(false);
        cmtContentEditRef.current.value="";
    }

    var cmtContentEditRef = useRef(null);

    const editDocument = async() => {
        var dataToEdit = {
            commentID: props.comment.comment._id,
            courseID: currentCourse._id,
            parrentCommentID: "",
            content: cmtContentEditRef.current.value,
        }
        setIsEditDocument(false);
        // console.log("dataToEdit", dataToEdit);
        await AjaxHelper.put(URL_API.URL_SYSTEM_V1 + '/discussions/comment', dataToEdit)
        .then(res => {
            dispatch(setCurrentCourse(res.data.currentCourse));
        })
        .catch(err => {
        })
    }

    if(Object.keys(props.comment).length===0) return null;
    return (
        <div className='chat-user-model'>
            {
                isEditDocument ? null : 
                <div className='chat-user-model__header'>
                    <Avatar sx={{ marginRight: '12px' }} height={36} width={36} alt="Remy Sharp" 
                        src={props.comment.comment ? props.comment.comment.avatar : ""}
                    />
                    <div style={{ fontFamily: "'Montserrat', san-serif" }} className='name'>
                        {
                            props.comment.comment ? props.comment.comment.username : ""
                        }   
                    </div>
                    <div style={{ fontFamily: "'Montserrat', san-serif" }} className='time'>
                        {
                            props.comment.comment ? calculateTime(props.comment.comment.time) : ""
                        }
                    </div>
                </div>
            }
                <div className='chat-user-model__content'>
                    {!isEditDocument ? 
                    [
                        <div className='content'>
                        {props.comment.comment ? props.comment.comment.content : ""}
                        </div>,
                        <div className='like-cmt'>
                            {
                                props.comment.comment && props.comment.comment.likes.includes(currentUserInfo._id) 
                                ?   <div 
                                        className="like-cmt-button unlike"
                                        onClick={() => {
                                            unlikeComment();
                                        }}
                                        style={{ marginRight: '27px', cursor: 'pointer' }}
                                    >
                                        <MdThumbUp size={16}></MdThumbUp>
                                    </div>
                                :   <div 
                                        className="like-cmt-button"
                                        onClick={() => {
                                            likeComment();
                                        }}
                                        style={{ marginRight: '27px', cursor: 'pointer' }}
                                    >
                                        <ThumbUpOutlinedIcon></ThumbUpOutlinedIcon>
                                    </div>
                            }
                            
                            <div style={{ marginRight: '27px', transform: 'translateY(8%)', cursor: 'pointer' }}> 
                                <ForumOutlinedIcon
                                    onClick = {() => {
                                        setDisplayAnswer(!displayAnswer);
                                    }}
                                ></ForumOutlinedIcon>
                            </div>
                            <div style={{ fontFamily: "'Montserrat', san-serif" }} className='like'>{props.comment.comment ? props.comment.comment.likes.length: '0'} likes</div>
                        </div>,
                        <div className="manage-container">
                            {

                                props.comment.comment && props.comment.comment.user &&
                                (typeof props.comment.comment.user != 'undefined')  
                                && currentUserInfo._id === props.comment.comment.user ?
                                <FiMoreHorizontal 
                                    className='icon-more'
                                    size={20}
                                    onClick={()=> {
                                        setIsOpenManage(!isOpenManage);
                                    }}
                                /> 
                                :null
                            }
                            {
                                isOpenManage ? 
                                
                                    <div className="manage-item-container">
                                        <div className='manage-item'
                                            onClick={() => {
                                                deleteComment();
                                            }}
                                        >
                                            Delete comment
                                        </div>
                                        <div className='manage-item'
                                            onClick={() => {
                                                toEditComment();
                                            }}
                                        >
                                            Edit comment
                                        </div>
                                    </div>
                                    
                                
                                : (null)
                            }
                            
                        </div>
                    ]
                    :
                    <div className='enter-chat enter-chat-1'>
                        <Avatar 
                            className="user-avatar"
                            sx={{ marginRight: '12px' }} 
                            height={36} width={36} 
                            alt="Remy Sharp" 
                            src={currentUserInfo ? currentUserInfo.profilePicture : ""}
                        />
                        <input 
                            className='chat-input edit-content' 
                            type={'text'}
                            ref = {cmtContentEditRef} 
                            defaultValue = {props.comment.comment ? props.comment.comment.content : ""}
                        >
                        </input>
                        <div 
                            className='btn-send btn-cancel'
                            onClick={()=>{
                                // dispatch(addComment({data:"ok"}));
                                // console.log(currentCourse);
                                // addNewComment();
                                cancelEdit();
                            }}
                        >
                            Cancel
                        </div>
                        <div 
                            className='btn-send'
                            onClick={()=>{
                                // dispatch(addComment({data:"ok"}));
                                // console.log(currentCourse);
                                // addNewComment();
                                editDocument();
                            }}
                        >
                            Edit
                        </div>
                    </div>
                }
                {
                    displayAnswer 
                    ? 
                    <div className='enter-chat' style={{marginBottom: '20px'}}>
                        <Avatar 
                            sx={{ marginRight: '12px' }} 
                            height={36} width={36} 
                            alt="Remy Sharp" 
                            src={currentUserInfo ? currentUserInfo.profilePicture : ""}
                        />
                        <input 
                            className='chat-input' 
                            type={'text'}
                            ref = {cmtContentRef} 
                        >
                            
                        </input>
                        <div 
                            className='btn-send'
                            onClick={()=>{
                                // dispatch(addComment({data:"ok"}));
                                // console.log(currentCourse);
                                addNewComment();
                            }}
                        >
                            Send
                        </div>
                    </div>
                    : null
                }
                {
                    props.comment.comment ? props.comment.comment.repliedComments.map((value, index,key) => {
                        return (
                        <ReplyCommentCard 
                            comment={value}
                            parrentCommentID={props.comment.comment._id}
                        />
                        );
                    })
                    : null
                }
                
            </div>
        </div>
    );
}

export default CommentCard;