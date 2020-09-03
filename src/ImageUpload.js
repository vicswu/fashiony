import React, {useState} from 'react'
import './ImageUpload.css';

// Material UI
import Button from '@material-ui/core/Button';

// Firebase 
import {storage, db} from './firebase';
import firebase from 'firebase';

function ImageUpload({username}) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
            },
            () => {
                storage.ref("images").child(image.name).getDownloadURL().then((url) => {
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageURL: url,
                        username: username
                    });
                    setProgress(0);
                    setCaption('');
                    setImage(null);
                });
            }
        );
    };

    return (
        <div className="imageUpload">
            <progress className="imageUpload_progress" value={progress} max="100"/>
            <input type="text" placeholder="Enter a caption..." value={caption} onChange={event => setCaption(event.target.value)}/>
            <input type="file" onChange={handleChange}/>
            <Button disabled={!image} onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
