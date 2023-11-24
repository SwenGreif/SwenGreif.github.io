const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
]).then(startWebcam);

function startWebcam() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error + 'what?');
    });
}

video.addEventListener('play',  () =>{
  // const canvas = faceapi.createCanvasFromMedia(video);
  const canvas = document.getElementById("canvasOutput");
  const rahmen = document.getElementById('canvasDetect');
  setInterval(async () =>{

    const detections = await faceapi.detectAllFaces(
      video,
      new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();
      canvas.getContext("2d").clearRect(0,0,canvas.width, canvas.height);
      try{
      const box = detections[0].detection.box;
      

    const sollBereich = {
      x: video.width*0.2, 
      y: video.height*0.1, 
      width: video.width*0.6, 
      height: video.height*0.8
    }
    console.log((box.x >= sollBereich.x)&&
    (box.y >= sollBereich.y)&&
    (box.x +box.width <= sollBereich.x + sollBereich.width)&&
    (box.y +box.height <= sollBereich.y + sollBereich.height));
    let color = 'red';
    let sound = new Audio('ping.mp3');

    if ((box.x >= sollBereich.x)&&
        (box.y >= sollBereich.y)&&
        (box.x +box.width <= sollBereich.x + sollBereich.width)&&
        (box.y +box.height <= sollBereich.y + sollBereich.height)){
                    
          color = 'green'	;
          // sound.play();
                    
        }else if (((box.x < sollBereich.x)&&
        (box.y < sollBereich.y)&&
        (box.x +box.width > sollBereich.x + sollBereich.width)&&
        (box.y +box.height > sollBereich.y + sollBereich.height))|| !box.length) {
        
          // rahmen.getContext("2d").clearRect(0,0,rahmen.width, rahmen.height)
          color= 'red';
         
        }
      

    let boxOptions= {
      label: 'Sollbereich für das Gesicht',
      lineWidth: 5,
      boxColor: color
    }


    

   faceapi.draw.drawDetections(document.getElementById('canvasOutput'), detections);
   faceapi.draw.drawFaceLandmarks(document.getElementById('canvasOutput'), detections);
    
   const testbox = { x: video.width*0.2, y: video.height*0.1, width: video.width*0.6, height: video.height*0.8 }
   const drawBox = new faceapi.draw.DrawBox(sollBereich, boxOptions)
   drawBox.draw(document.getElementById('canvasDetect'))
  }catch{
    console.log('no faces detected');
  }

  }, 100);

});
