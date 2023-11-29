const video = document.getElementById("video");
const sound = new Audio('sounds/ping.mp3');
const left = new Audio('sounds/links.mp3');
const right = new Audio('sounds/rechts.mp3');
const up = new Audio('sounds/oben.mp3');
const down = new Audio('sounds/unten.mp3');
const enter = new Audio('sounds/enter.mp3');

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
      console.error(error);
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
          // console.log((box.x >= sollBereich.x)&&
          // (box.y >= sollBereich.y)&&
          // (box.x +box.width <= sollBereich.x + sollBereich.width)&&
          // (box.y +box.height <= sollBereich.y + sollBereich.height));

          console.log((box.x +box.width <= sollBereich.x + sollBereich.width));
          console.log((box.y +box.height <= sollBereich.y + sollBereich.height));

          let color = 'red';
        

          

          if ((box.x >= sollBereich.x)&&
              (box.y >= sollBereich.y)&&
              (box.x +box.width <= sollBereich.x + sollBereich.width)&&
              (box.y +box.height <= sollBereich.y + sollBereich.height)){
                
                
                color = 'green'	;
                sound.play();
                
                
                 
              
              clearInterval(intervalID);
               document.getElementById("startButton").style.display = 'flex';
               document.getElementById("startButton").focus();
              //  enter.play();
                          
          }else if (((box.x < sollBereich.x)||
              (box.y < sollBereich.y)||
              (box.x +box.width > sollBereich.x + sollBereich.width)||
              (box.y +box.height > sollBereich.y + sollBereich.height))|| !box.length) {
              

                if (box.x +box.width > sollBereich.x + sollBereich.width) {
                  
                }
                // rahmen.getContext("2d").clearRect(0,0,rahmen.width, rahmen.height)
                color= 'red';
                console.log("move");
                if ( (box.x +box.width > sollBereich.x + sollBereich.width)) {
                  right.play();
                  

                }else if(box.x < sollBereich.x){
                  left.play();
                  
                }else if(box.y < sollBereich.y){
                  down.play();
                  
                }else if(box.y +box.height > sollBereich.y + sollBereich.height){
                  up.play();
                  
                }
              
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
            document.getElementById('loadAnimation').style.display ='none';
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

  }, 1500);
};

