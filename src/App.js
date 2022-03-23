import React, {useState, useRef, useEffect} from 'react';
import './App.css';
import Webcam from "react-webcam";
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';

const WebcamComponent = () => <Webcam />;

const videoConstraints = {
  width: 1920,
  height: 1080,
  // facingMode: { exact: "environment" }
  facingMode: 'user'
};

function App() {
  const [image,setImage]=useState('');
  const [fimage, setFimage] = useState('');
  const [open, setOpen] = useState(false);

  const webcamRef = React.useRef(null);
  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
      sendImg(imageSrc);
    },

    [webcamRef]
  );

  async function sendImg(img) {
    if(img === '') return ;
    await axios.post('http://localhost:4000/index', {img : img.substr(23)})
    .then(async(res) => {console.log(res.data); await setFimage(res.data)})
  }

  function saveImg(img) {
    if(img !== '')
    // axios.post('', img)
    // .then((res) => setImage(''))
    setFimage('');
    setOpen(true);
  }

  useEffect(() => {
    // if(image !== '') return ;
    // sendImg(image);
    setImage(fimage);
  }, [fimage])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        OKAY
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        {/* <CloseIcon fontSize="small" /> */}
      </IconButton>
    </React.Fragment>
  );

    return (
      <div className="App" >
        <Webcam 
        audio={false}
        height={1080}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1920}
        videoConstraints={videoConstraints}
        className="webcam"
        screenshotQuality={1}
        />
        <button className='b1' onClick={(e)=>{e.preventDefault();capture();}} >
      Capture</button>
      <div >
        {
          fimage !== '' ?
          <>
          <img src={`data:image/png;base64,${fimage}`} />
          <div className='buttons' >
          <button className="b1" onClick={() => saveImg(fimage)} >Accept</button>
          <button className="b1" onClick={() => setFimage('')} style={{backgroundColor: 'red'}} >Rescan</button>
          </div>
          </>
          : 
          <></>
        }
        <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Image have been saved!"
        action={action}
      />
      </div>
      </div>
    )
}

export default App;
