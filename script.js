//fetch the id of video element from the html-template
const video = document.getElementById("video");

//define the sound for user instructions
const sound = new Audio('sounds/ping.mp3');
const left = new Audio('sounds/links.mp3');
const right = new Audio('sounds/rechts.mp3');
const up = new Audio('sounds/oben.mp3');
const down = new Audio('sounds/unten.mp3');
const enter = new Audio('sounds/enter.mp3');
const noFace = new Audio('sounds/noFace.mp3');
const faceFound = new Audio('sounds/faceDetected.mp3');

//define the frame for the "sollBereich"
let color = 'red';
const sollBereich = {
  x: video.width*0.2, 
  y: video.height*0.1, 
  width: video.width*0.6, 
  height: video.height*0.8
}

let boxOptions= {
  label: 'Sollbereich für das Gesicht',
  lineWidth: 5,
  boxColor: color
}

//wait untill all the needed models are loaded, then start the webcam 
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
]).then(startWebcam);


//start client side webcam an
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

//start the face detection as soon as the videostream ist playing
video.addEventListener('play',  () =>{
  startFaceDetection();
});


//function for the face detection
function startFaceDetection(){

  //reset default of the button, hidden by default and when facedetection is running
  document.getElementById("startButton").style.display = 'none';
  
  const canvas = document.getElementById("canvasOutput");
  const rahmen = document.getElementById('canvasDetect');

  //set interval to start the face detection over and over again, until a face is detected
  let intervalID = setInterval(async () =>{

    //start of actual face detection: analyse for faces in the video stream
    const detections = await faceapi.detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        //resize the dectection dimensions to fit exactly on top of the videostream  
        const resizedDetections = faceapi.resizeResults(detections, {height: video.height, width: video.width});
        //clear canvas of old detections and landmarks
        canvas.getContext("2d").clearRect(0,0,canvas.width, canvas.height);

      try{
          // This option is to extract the uncorrected face detections        
          // const box = detections[0].detection.box;

          // get corrected face detection coordinates to analyze the position 
          const box = resizedDetections[0].alignedRect.box;

          // let color = 'red';
        
          //check if face coordinates are within the defined "sollBereich"
          if ((box.x >= sollBereich.x)&&
              (box.y >= sollBereich.y)&&
              (box.x +box.width <= sollBereich.x + sollBereich.width)&&
              (box.y +box.height <= sollBereich.y + sollBereich.height)){
                
                //if yes,than SollBereich schould be framed green
                boxOptions.boxColor = 'green'	;
                sound.play();
                faceFound.play();
                
                //clear the Interval, stop face detection and display button to start it again
               clearInterval(intervalID);
               document.getElementById("startButton").style.display = 'flex';
               document.getElementById("startButton").focus();
              
          //if the detected face isn't with in the borders of he "sollBereich"  or no face is detected, let color be red           
          }else if (((box.x < sollBereich.x)||
              (box.y < sollBereich.y)||
              (box.x +box.width > sollBereich.x + sollBereich.width)||
              (box.y +box.height > sollBereich.y + sollBereich.height))) { //|| !box.length
        
                boxOptions.boxColor= 'red';
                
                //check if and at wich side the face is over the "sollBereich" border
                // play instructions to help users position them self within the borders of the "sollBereich"
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

          //draw the detected frame and landmarks of the face onto the output canvas in the HTML template  
          faceapi.draw.drawDetections(document.getElementById('canvasOutput'), resizedDetections);
          faceapi.draw.drawFaceLandmarks(document.getElementById('canvasOutput'), resizedDetections);
              
          // draw frame of "sollBereich"
          const drawBox = new faceapi.draw.DrawBox(sollBereich, boxOptions);
          drawBox.draw(rahmen);
          document.getElementById('loadAnimation').style.display ='none';

        // if faceapi can't find any face, this error is catched and an info sound is played to inform the user
        }catch (error){
          document.getElementById('loadAnimation').style.display ='none';
          boxOptions.boxColor = 'red';
          const drawBox = new faceapi.draw.DrawBox(sollBereich, boxOptions);
          drawBox.draw(document.getElementById('canvasDetect'));
          //sound indicates that there is no face, but can be destracting for screen reader users
          noFace.play();
          console.log(error + 'no faces detected');
        }
    //set Intervall shorter to give tunes time to play till end befor new tune is started
  }, 1500);
};

