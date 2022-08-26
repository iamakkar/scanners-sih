import React, { useState, useEffect } from 'react';
import './App.css';
import Webcam from "react-webcam";
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faTrash, faMagicWandSparkles, faCamera, faCameraRotate,faAngleUp, faAngleDown,  } from '@fortawesome/free-solid-svg-icons';

// import loadingGif from "./giphy.gif";
import ReactLoading from "react-loading";

// import uploadingGif from "./loading-icon-animated-gif-19.jpg";

import { storage, db } from './Config/Firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, setDoc, getDoc, doc } from 'firebase/firestore';
import jsPDF from "jspdf";
import SweetAlert from 'react-bootstrap-sweetalert';
import { useParams } from "react-router";

const audio_src = './shutter.mp3'

const WebcamComponent = () => <Webcam />;

// const SERVER_URL = 'https://3da2-103-167-127-148.in.ngrok.io/index';
// const SERVER_URL2 = 'https://3da2-103-167-127-148.in.ngrok.io/filtered';

const SERVER_URL = 'https://scanner-backend.herokuapp.com/index';
const SERVER_URL2 = 'https://scanner-backend.herokuapp.com/filtered';

const videoConstraints = {
  width: 2430,
  height: 4320,
  facingMode: { exact: "environment" },
  // facingMode: 'user',
};

function App(props) {

  const {id}=useParams();
  console.log(id);

  const [image, setImage] = useState('');
  const [fimage, setFimage] = useState([]);
  const [open, setOpen] = useState(false);
  const [crop, setCrop] = useState(null);
  const [imagearr, setImagearr] = useState([]);
  const [imagearrOrig, setImagearrOrig] = useState([]);
  const [rotateAngle, setRotateAngle] = useState([]);
  const [imageName, setImageName] = useState([]);
  const [loading, setLoading] = useState([]);
  const [is_sending, set_is_sending] = useState(false);
  const [folderName, setFolderName] = useState();
  const [upload, setUpload] = useState(false);
  const [uploadBool, setUploadBool] = useState(false);
  const [blurIndex,setBlurIndex] = useState(-1);
  const [isPreview, setIsPreview] = useState({
    is: false,
    img: "",
  });

  const webcamRef = React.useRef(null);

  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImagearr(img => [...img, imageSrc]);
      setImagearrOrig(img => [...img, imageSrc]);
      setRotateAngle(dat => [...dat, 0]);
      setLoading(cur => [...cur, false]);
      setImageName(dat => [...dat, dat.length+1]);
      // setImage(imageSrc);
      // sendImg(imageSrc);
    },

    [webcamRef]
  );

  async function uploadImg() {
    setUploadBool(true);
    let link = [];
    await Promise.all(imagearr.map(async (data, idx) => {
      const storageRef = ref(storage, `${folderName}/${imageName[idx]}`);
      const base64Response = await fetch(imagearr[idx]);
      const blob = await base64Response.blob();

      await uploadBytes(storageRef, blob);
      let url = await getDownloadURL(storageRef);
      link.push({url:url,name:imageName[idx]});
    }));

    setUpload(true);
    setUploadBool(false);

    let gotDataDoc = await getDoc(doc(db, 'Documents', id));
    let tempData={
      items: [...link],
      name: folderName,
      timestamp: Date.now()
    }
    if(gotDataDoc.exists()){
      let gotData = gotDataDoc.data();
      console.log(gotData.length);
      await setDoc(doc(db, "Documents", id), {data : [...gotData.data, tempData]});
    }else{
      await setDoc(doc(db, "Documents", id), {data: [tempData]});
    }

    // await setDoc(doc(db, "Documents", id), [...gotData, tempData]);

    // await addDoc(collection(db, 'Documents'), {
    //   items: [...link],
    //   name: folderName,
    //   timestamp: Date.now()
    // });


  }

  async function sendImg(idx) {
    if (imagearr === []) return;
    set_is_sending(true);
    let s = imagearr[idx].slice(23);
    console.log(s);
    let temp_load = loading;
    temp_load[idx] = true;
    setLoading([...temp_load]);
    await axios.post(SERVER_URL, { img: s }).then((res) => {
      if(res.data=='blurred'){
        setBlurIndex(idx);
        return;
      }
      // setTimeout(() => {  }, 5000);
      // console.log(res.data) //23 char
      let temp = imagearr;
      temp[idx] = 'data:image/jpeg;base64,' + res.data;
      setImagearr([...temp]);
      set_is_sending(false);
    }).catch(error => {
      console.log(error);
    })
    temp_load = loading;
    temp_load[idx] = false;
    setLoading([...temp_load]);
    console.log("done");
  }

  async function filterFunc(idx, num) {
    if (num == 0) {
      let tempy = imagearr;
      tempy[idx] = imagearrOrig[idx];
      setImagearr([...tempy]);
      return;
    }
    if (imagearr === []) return;
    set_is_sending(true);
    let s = imagearrOrig[idx].slice(23);
    console.log(s);
    let temp_load = loading;
    temp_load[idx] = true;
    setLoading([...temp_load]);
    await axios.post(SERVER_URL2, { img: s, filter: num - 1 }).then((res) => {
      // setTimeout(() => {  }, 5000);
      // console.log(res.data) //23 char
      let temp = imagearr;
      temp[idx] = 'data:image/jpeg;base64,' + res.data;
      setImagearr([...temp]);
      set_is_sending(false);
    }).catch(error => {
      console.log(error);
    })
    temp_load = loading;
    temp_load[idx] = false;
    setLoading([...temp_load]);
    console.log("done");
  }

  async function blurFunc(){
    pageDelete(blurIndex);
    setBlurIndex(-1);
  }

  async function rotate(idx) {
    if (imagearr === []) return;
    let temp = rotateAngle;
    temp[idx] += 90;
    setRotateAngle([...temp]);
  }

  async function setImageNameFunc(e,idx){
    let temp=imageName;
    temp[idx]=e.target.value;
    setImageName([...temp]);
  }

  // async function savePDF(){
  //   const doc = new jsPDF();
  //   doc.deletePage(1);
  //   for(let img in imagearr){
  //     doc.addImage(img);
  //   }
  //   const pdfURL = doc.output("bloburl");
  //   const pdfWindow = window.open();
  //   pdfWindow.location.href = pdfURL;   
  //   // window.open(pdfURL as any, "_blank");
  // }

  function saveImg(img) {
    if (img !== '')
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
    if (cur > n) {
      return alert(`Enter number less than or equal to ${n}`);
    }
    if (cur === prev) return;
    let temp = imagearr;
    if (cur > prev) {
      for (let i = prev - 1; i < cur - 1; i += 1) {
        let x = temp[i + 1];
        temp[i + 1] = temp[i];
        temp[i] = x;
      }
    } else {
      for (let i = prev - 1; i > cur - 1; i -= 1) {
        let x = temp[i];
        temp[i] = temp[i - 1];
        temp[i - 1] = x;
      }
    }
    setImagearr([...temp]);
  }

  function pageDelete(idx) {
    setImagearr(img => img.filter(function (s, i) {
      return i !== idx;
    }))

    setImagearrOrig(img => img.filter(function (s, i) {
      return i !== idx;
    }))

    setRotateAngle(dat => dat.filter(function (s, i) {
      return i !== idx;
    }))

    setImageName(dat => dat.filter(function(s,i){
      return i !== idx;
    } ))
  }

  // function pageDelete(n) {
  //   setImagearr(img => img.filter(function(s) {
  //     return s !== n;
  //   })
  //   )

  //   setImagearrOrig(img => img.filter(function(s) {
  //     return s !== n;
  //   })
  //   )
  // }

  function pageUp(idx) {
    let temp = imagearr;
    let t = temp[idx];
    temp[idx] = temp[idx - 1];
    temp[idx - 1] = t;
    setImagearr([...temp]);

    let temp2 = imagearrOrig;
    let t2 = temp2[idx];
    temp2[idx] = temp2[idx - 1];
    temp2[idx - 1] = t2;
    setImagearrOrig([...temp2]);

    let temp3 = rotateAngle;
    let t3 = temp3[idx];
    temp3[idx] = temp3[idx - 1];
    temp3[idx - 1] = t3;
    setRotateAngle([...temp3]);

    let temp4 = imageName;
    let t4 = temp4[idx];
    temp4[idx] = temp4[idx - 1];
    temp4[idx - 1] = t4;
    setImageName([...temp4]);
  }

  function pageDown(idx) {
    let temp = imagearr;
    let t = temp[idx];
    temp[idx] = temp[idx + 1];
    temp[idx + 1] = t;
    setImagearr([...temp]);

    let temp2 = imagearrOrig;
    let t2 = temp2[idx];
    temp2[idx] = temp2[idx + 1];
    temp2[idx + 1] = t2;
    setImagearrOrig([...temp2]);

    let temp3 = rotateAngle;
    let t3 = temp3[idx];
    temp3[idx] = temp3[idx + 1];
    temp3[idx + 1] = t3;
    setRotateAngle([...temp3]);

    let temp4 = imageName;
    let t4 = temp4[idx];
    temp4[idx] = temp4[idx + 1];
    temp4[idx + 1] = t4;
    setImageName([...temp4]);
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
    <div className="App" style={{ alignItems: 'center',
      backgroundColor: '#ececec',
      // backgroundColor: '#f8f8ff',
      // height: '100vh',
      }}>
      {blurIndex==-1?null:<SweetAlert
        title={"Retake the image"}
        type={'danger'}
        confirmBtnBsStyle={{backgroundColor:'black', border: 'none', boxShadow:'none', color:'white', textDecoration:'none', width:'10%'}}
        onConfirm={blurFunc}
        />}
      <div style={{ display: 'flex', flexDirection: 'column', width: '90%', height: '80%', margin: 'auto'/*,border: '1px solid black', borderRadius: '0.6%'*/ }}>
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
      </div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
        <button className='b1' onClick={(e) => { e.preventDefault(); capture(); }} ><FontAwesomeIcon style={{ fontSize: '25px', margin: 0 }} icon={faCamera} /></button>
      </div>
      <div style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'center'}}>
        {
          image !== '' ?
            <>
              <img src={image} />
            </>
            :
            <></>
        }
        {
          isPreview.is && <dialog
            style={{ position: "absolute", zIndex: 999 }}
            open
            onClick={() => { setIsPreview({ is: false, img: "" }) }}
          >
            <img
              src={isPreview.img}
              onClick={() => { setIsPreview({ is: false, img: "" }) }}
              alt="no image"
            />
          </dialog>
        }
        {
          imagearr.map((data, idx) => {
            // let [p, sp] = useState(idx+1);
            let p = idx + 1;
            return (
              <div style={{
              // borderWidth: 5,
              padding: '5%',
              // borderColor: 'black',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              // border: '1px solid black',
              borderRadius: '8%',
              width: '85%',
              margin: '2%',
              backgroundColor: 'whitesmoke',
              }} >
                {!loading[idx] ?
                  <img src={data} style={{ width: '-webkit-fill-available', transform: `rotate(${rotateAngle[idx]}deg)`, margin: (rotateAngle[idx] / 90) % 2 == 1 ? '25% 0' : '0' }} alt="err" onClick={() => setIsPreview({ is: true, img: data })} /> :
                  // <img style={{ width: '-webkit-fill-available' }} src={loadingGif} />
                  <div style={{padding: 30}} >
                  <ReactLoading type='spin' color='black' />
                  </div>
                }
                <input value={imageName[idx]} style={{ fontWeight: 'bold', margin: '10px 20px', fontSize: '20px' }} onChange={(e)=>setImageNameFunc(e,idx)} />
                {/* <input onChange={(e) => {p = e.target.value}} ></input>
              <button onClick={() => pageChange(p, idx+1)} >Change Page</button> */}
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <FontAwesomeIcon style={{ margin: '10px 10px', fontSize: '20px', cursor: 'pointer' }} icon={faTrash} onClick={() => pageDelete(idx)} />
                  {idx !== 0 && <FontAwesomeIcon style={{ margin: '10px 10px', fontSize: '20px', cursor: 'pointer' }} icon={faAngleUp} onClick={() => pageUp(idx)} />}
                  {idx !== imagearr.length - 1 && <FontAwesomeIcon style={{ margin: '10px 10px', fontSize: '20px', cursor: 'pointer' }} icon={faAngleDown} onClick={() => pageDown(idx)} />}
                  <FontAwesomeIcon style={{ margin: '10px 10px', fontSize: '20px', cursor: 'pointer' }} icon={faCameraRotate} onClick={() => rotate(idx)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <button className='b2' style={{ padding: '6px', cursor: 'pointer' }} onClick={() => filterFunc(idx, 0)}>Original</button>
                  <button className='b2' style={{ padding: '6px', cursor: 'pointer' }} onClick={() => filterFunc(idx, 2)}>White Board</button>
                  <button className='b2' style={{ padding: '6px', cursor: 'pointer' }} onClick={() => filterFunc(idx, 2)}>Contrast</button>
                  <button className='b2' style={{ padding: '6px', cursor: 'pointer' }} onClick={() => filterFunc(idx, 3)}>Grayscale</button>
                </div>
                <button className='b3' onClick={() => sendImg(idx)} >Send</button>
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto' }}>
        <input placeholder='Enter The Folder Name' style={{ fontSize: 'large', width: 'fit-content', margin: '10px', fontStyle: 'oblique' }} onChange={e => setFolderName(e.target.value)} ></input>
        {!uploadBool ? <button className='b3' style={{padding: '6%'}} onClick={() => uploadImg()} >Upload</button> :
          // <img style={{ width: '85%' }} src={uploadingGif} />
          <div style={{padding: 30}} >
          <ReactLoading type='bars' color='black' />
          </div>
        }
        {/* <button className='b1' style={{padding:'12px 20px'}} onClick={()=>uploadImg()} >Upload</button> */}
        {upload ? <SweetAlert
          title={"Successfully Uploaded!"}
          type={'success'}
          confirmBtnBsStyle={{backgroundColor:'black', border: 'none', boxShadow:'none', color:'white', textDecoration:'none', width:'10%'}}
          onConfirm={() => {setUpload(!upload)}}
          />
        : null}
      </div>
      {/* <div>
        <button className='b1' onClick={()=>savePDF()}> Generate PDF </button>
      </div> */}
    </div>
  )
}

export default App;
