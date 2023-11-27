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
  

  startFaceDetection();
});


function startFaceDetection(){
  document.getElementById("startButton").style.display = 'none';
  const canvas = document.getElementById("canvasOutput");
  const rahmen = document.getElementById('canvasDetect');
  let intervalID = setInterval(async () =>{

    const detections = await faceapi.detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

        const resizedDetections = faceapi.resizeResults(detections, {height: video.height, width: video.width});
        
        canvas.getContext("2d").clearRect(0,0,canvas.width, canvas.height);


    const sollBereich = {
      x: video.width*0.2, 
      y: video.height*0.1, 
      width: video.width*0.6, 
      height: video.height*0.8
    }

    let color = 'red';

      try{
          // const box = detections[0].detection.box;
            // const box2 = resizedDetections[0].detections.box;
          const box = resizedDetections[0].alignedRect.box;
          // const sollBereich = {
          //   x: video.width*0.2, 
          //   y: video.height*0.1, 
          //   width: video.width*0.6, 
          //   height: video.height*0.8
          // }
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
                sound.play();
               await clearInterval(intervalID);
               document.getElementById("startButton").style.display = 'flex';
                          
          }else if (((box.x < sollBereich.x)&&
              (box.y < sollBereich.y)&&
              (box.x +box.width > sollBereich.x + sollBereich.width)&&
              (box.y +box.height > sollBereich.y + sollBereich.height))&& !box.length) {
              
                // rahmen.getContext("2d").clearRect(0,0,rahmen.width, rahmen.height)
                color= 'red';
              
            }
            

          let boxOptions= {
            label: 'Sollbereich für das Gesicht',
            lineWidth: 5,
            boxColor: color
          }


          

            faceapi.draw.drawDetections(document.getElementById('canvasOutput'), resizedDetections);
            faceapi.draw.drawFaceLandmarks(document.getElementById('canvasOutput'), resizedDetections);
              
            const testbox = { x: video.width*0.2, y: video.height*0.1, width: video.width*0.6, height: video.height*0.8 }
            const drawBox = new faceapi.draw.DrawBox(sollBereich, boxOptions)
            drawBox.draw(rahmen)
            if(boxOptions.boxColor == 'green'){
             console.log('unterbrecher')
            }
        }catch (error){
           let color = 'red';
          const testbox = { x: video.width*0.2, y: video.height*0.1, width: video.width*0.6, height: video.height*0.8 }
          const drawBox = new faceapi.draw.DrawBox(sollBereich, {
            label: 'Sollbereich für das Gesicht',
            lineWidth: 5,
            boxColor: color
          })
          drawBox.draw(document.getElementById('canvasDetect'))
          console.log(error + 'no faces detected');
        }

  }, 100);
};

