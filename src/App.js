import React, {useState, useEffect} from 'react';
import './App.css';
import icon from './img/logo.png';

// Components
import Post from './Post';
import ImageUpload from './ImageUpload';

// Material UI
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';

// Firebase
import {db, auth} from './firebase';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        // user is no longer logged in
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({id: doc.id, post: doc.data()})));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))
    setOpen(false);
  };

  const login = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenLogin(false);
  };

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img className="app_headerImage" src={icon} alt="icon"/>
            </center>
            <Input placeholder="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" onClick={signUp}>Sign up</Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openLogin}
        onClose={() => setOpenLogin(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img className="app_headerImage" src={icon} alt="icon"/>
            </center>
            <Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" onClick={login}>Login</Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
      >
        <div style={modalStyle} className={classes.paper}>
            {user?.displayName ? (
              <ImageUpload username={user.displayName}/>
              ) : (
                <Typography className="app_centerText" variant="h6">Login to upload!</Typography>
              )}
        </div>
      </Modal>
      <div className="app_header">
        <img className="app_headerImage" src={icon} alt="icon"/>
            {user?.displayName ? (
              <div className="app_centerButton">
              <Button onClick={() => setOpenUpload(true)}>Create a new post!</Button>
              </div>
              ) : (
                <Typography className="app_centerText" variant="h6">Login to upload!</Typography>
              )}
        {user ? 
          (<div className="app_logoutContainer">
            <Button onClick={() => auth.signOut()}>Logout</Button>
           </div>) : 
          (<div className="app_loginContainer">
            <Button onClick={() => setOpenLogin(true)}>Log in</Button>
            <Button onClick={() => setOpen(true)}>Sign up</Button>
          </div>)}
          </div>
        <div className="app_posts">
          {posts.map(({id, post}) => (
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageURL={post.imageURL}/>))}
        </div>
      </div>
  );
}

export default App;
