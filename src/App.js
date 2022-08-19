import React, {useState, useEffect} from 'react';
import './App.css';
import Webcam from "react-webcam";
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faArrowUp, faArrowDown, faTrash } from '@fortawesome/free-solid-svg-icons';

const WebcamComponent = () => <Webcam />;

const SERVER_URL = 'https://scanner-backend.herokuapp.com/index/';

const videoConstraints = {
  width: 1920,
  height: 1080,
  facingMode: { exact: "environment" },
  // facingMode: 'user',
};

function App() {
  const [image,setImage]=useState('');
  const [fimage, setFimage] = useState([]);
  const [open, setOpen] = useState(false);
  const [crop, setCrop] = useState(null);
  const [imagearr, setImagearr] = useState([]);


  const webcamRef = React.useRef(null);

  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImagearr(img => [...img, imageSrc]);
      // setImage(imageSrc);
      // sendImg(imageSrc);
    },

    [webcamRef]
  );

  function sendImg(idx) {
    if(imagearr === []) return ;
    imagearr.forEach(async (e) => {
      let s = e.slice(23);
      console.log(s);
      await axios.post(SERVER_URL, {img: s}).then((res) => {
        console.log(res.data) //23 char
        let temp = imagearr;
        temp[idx] = 'data:image/jpeg;base64,' + res.data;
        setImagearr([...temp]);
      })
    })
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

  function pageChange(cur, prev) {
    let n = imagearr.length;
    if(cur > n) {
      return alert(`Enter number less than or equal to ${n}`);
    }
    if(cur === prev) return ;
    let temp = imagearr;
    if(cur > prev) {
      for(let i = prev-1; i < cur-1; i+=1) {
        let x = temp[i+1];
        temp[i+1] = temp[i];
        temp[i] = x;
      }
    } else {
      for(let i = prev-1; i > cur-1; i-=1) {
        let x = temp[i];
        temp[i] = temp[i-1];
        temp[i-1] = x;
      }
    }
    setImagearr([...temp]);
  }

  function pageDelete(n) {
    setImagearr(img => img.filter(function(s) {
      return s !== n;
    })
    )
  }

  function pageUp(idx) {
    let temp = imagearr;
    let t = temp[idx];
    temp[idx] = temp[idx-1];
    temp[idx-1] = t;
    setImagearr([...temp]);
  }

  function pageDown(idx) {
    let temp = imagearr;
    let t = temp[idx];
    temp[idx] = temp[idx+1];
    temp[idx+1] = t;
    setImagearr([...temp]);
  }
 
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
      <div className="App" style={{alignItems:'center'}}>
        <div style={{display:'flex',flexDirection:'column', width:'50%',margin:'auto',border: '1px solid black', borderRadius: '0.6%'}}>
          <Webcam 
          audio={false}
          // height={1080}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          // width={1920}
          videoConstraints={videoConstraints}
          className="webcam"
          screenshotQuality={1}
          />
          <button className='b1' onClick={(e)=>{e.preventDefault();capture();}} >
        Capture</button>
        </div>
      <div style={{display:'flex', flexFlow:'row wrap', justifyContent:'center'}}>
        {
          image !== '' ?
          <>
          <img src={image} />
          </>
          :
          <></>
        }
        {
          imagearr.map((data, idx) => {
            // let [p, sp] = useState(idx+1);
            let p = idx+1;
            return (
              <div style={{
              // borderWidth: 5,
              // padding: 20,
              // borderColor: 'black',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid black',
              borderRadius: '0.6%',
              width: '40%',
              margin: '2%'
              }} >
              <img src={data} style={{width:'-webkit-fill-available'}} />
              <p style={{fontWeight: 'bold', margin: '10px 20px', fontSize: '20px'}} >{idx+1}</p>
              {/* <input onChange={(e) => {p = e.target.value}} ></input>
              <button onClick={() => pageChange(p, idx+1)} >Change Page</button> */}
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <FontAwesomeIcon style={{margin: '10px 20px', fontSize: '20px'}} icon={faTrash} onClick={() => pageDelete(data)} />
                {idx !== 0 && <FontAwesomeIcon style={{margin: '10px 20px', fontSize: '20px'}} icon={faArrowUp} onClick={() => pageUp(idx)} />}
                {idx !== imagearr.length-1 && <FontAwesomeIcon style={{margin: '10px 20px', fontSize: '20px'}} icon={faArrowDown} onClick={() => pageDown(idx)} />}
              </div>
              <button className='b1' onClick={()=>sendImg(idx)} >
              Send</button>
              </div>
            )
          })
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
