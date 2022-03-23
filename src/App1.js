import React, {useState, useRef, useEffect} from 'react';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  // const webcamRef = useRef(null);

  const [hasPhoto, setHasPhoto] = useState(false);

  function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: {height: window.innerHeight*0.75, width: window.innerWidth*0.8} })
    .then(stream => {
      let vid = videoRef.current
      vid.srcObject = stream;
      vid.play()
    })
    .catch(err => {
      console.log(err); 
    })
  }

  function takePhoto() {
    let v = videoRef.current;
    let p = photoRef.current;

    p.width = window.innerWidth*0.8;
    p.height = window.innerHeight*0.75;

    let con = p.getContext('2d');
    con.drawImage(v, 0, 0, window.innerWidth*0.8, window.innerHeight*0.75);
    setHasPhoto(true);

    // const img = webcamRef.current.getScreenshot();
    // console.log(img);
  }

  function closePhoto() {
    let p = photoRef.current;
    let ct = p.getContext('2d');
    ct.clearRect(0, 0, window.innerWidth*0.8, window.innerHeight*0.75);
    setHasPhoto(false);
  }

  useEffect(() => {
    getVideo();
  }, [videoRef])

    return (
      <div className="App" >
        <div className="camera">
          <video ref={videoRef} ></video>
          <button className="b1" onClick={takePhoto} >Click</button>
        </div>
        <div className={"result" + (hasPhoto ? 'has' : '')} >
          <canvas ref={photoRef} ></canvas>
          <div className='buttons' >
          <button className="b1" onClick={closePhoto} >Accept</button>
          <button className="b1" onClick={closePhoto} style={{backgroundColor: 'red'}} >Rescan</button>
          </div>
        </div>
      </div>
    )
}

export default App;
