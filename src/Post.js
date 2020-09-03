import React from 'react'
import './Post.css';

// Material UI 
import Avatar from '@material-ui/core/Avatar';

function Post({username, caption, imageURL}) {
    return (
        <div className="post">
            <div className="post_header">
            <Avatar 
                className="post_avatar"
                alt='Username'
                src="https://bsbproduction.s3.amazonaws.com/portals/2812/images/29213190-stock-vector-businessman-silhouette-avatar-profile-picture.jpg"
            />
            <h3>{username}</h3>
            </div>
            <img className="post_image" src={imageURL} alt="fashiony"/>
            <h4 className="post_text"><strong>{username}</strong> {caption}</h4>
        </div>
    )
}

export default Post
