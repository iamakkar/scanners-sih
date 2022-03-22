import React, {useState, useRef, useEffect} from 'react';

function App() {
  const videoRef = useRef(null);
  const photoRef = useRef(null);

  const [hasPhoto, setHasPhoto] = useState(false);

  function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: {height: 1920, width: 1080} })
    .then(stream => {
      let vid = videoRef.current
      vid.srcObject = stream;
      vid.play()
    })
    .catch(err => {
      console.log(err); 
    })
  }

  useEffect(() => {
    getVideo();
  }, [videoRef])

    return (
      <div className="App" >
        <div className="camera">
          <video ref={videoRef} ></video>
          <button>Click</button>
        </div>
        <div className={"result" + (hasPhoto ? 'has' : '')} >
          <canvas ref={photoRef} ></canvas>
          <button>Close</button>
        </div>
      </div>
    )
}

export default App;
