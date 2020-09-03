import React, {useState, useEffect} from 'react'
import './Post.css';

// Material UI 
import Avatar from '@material-ui/core/Avatar';

// Firebase
import {db} from './firebase';
import firebase from 'firebase';

function Post({postId, user, username, caption, imageURL}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db.collection("posts").doc(postId).collection("comments").orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }
        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    };

    return (
        <div className="post">
            <div className="post_header">
            <Avatar 
                className="post_avatar"
                alt='Username'
                src="https://icon-library.com/images/no-profile-pic-icon/no-profile-pic-icon-24.jpg"
            />
            <h3>{username}</h3>
            </div>
            <img className="post_image" src={imageURL} alt="fashiony"/>
            <h4 className="post_text"><strong>{username}</strong> {caption}</h4>

            <div className="post_comments">
                {comments.map((comment) => (
                    <p className="post_comment">
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>
            {user && (
                <form className="post_commentBox">
                <input className="post_input" type="text" placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)}/>
                <button className="post_button" type="submit" disabled={!comment} onClick={postComment}>
                    Post
                </button>
            </form>
            )}
        </div>
    )
}

export default Post
