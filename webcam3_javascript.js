

const video = document.getElementById('videoInput'); 
// navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//     .then(function(stream) {
//         video.srcObject = stream;
//          //video.play();
//        console.log("erster aufruf")
//     })
//     .catch(function(err) {
//         console.log("An error occurred! " + err);
//     });

function startVideo(){
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}
async function createFileFromUrl(url, filePath) {
    try {
        const response = await fetch(url);
        const buffer = await response.buffer();
        await this.writeFile(filePath, buffer);
        console.log(`File ${filePath} created successfully from ${url}`);
    } catch (error) {
        console.error(`Error creating file from ${url}: ${error}`);
    }
}
function testLoad(){
    let utils = new Utils('errorMessage');
    let url = 'https://github.com/opencv/opencv/raw/4.x/data/haarcascades/haarcascade_frontalface_default.xml';
    let faceCascadeFile = 'haarcascade_frontalface_default.xml'; // path to xml
    let classifier = new cv.CascadeClassifier();
    utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
        classifier.load(faceCascadeFile); // in the callback, load the cascade from file 
        })

       
        if(classifier.load('haarcascade_frontalface_default.xml'))
        {
         console.log('cascade loaded');
        }else{
        console.log("cascade not loaded");
        }
    return classifier;
}


function cpyVideo(){
    let canvasFrame = document.getElementById("canvasOutput");
    let context = canvasFrame.getContext("2d");
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let cap = new cv.VideoCapture(video);
    let faces = new cv.RectVector();
    
    let FPS = 30;
    function processVideo() {
        let begin = Date.now();
        cap.read(src);
        // src.copyTo(dst);
         cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
         
        let pnt1 = new cv.Point(video.width*0.2,video.height*0.1);
        let pnt2 = new cv.Point(video.width*0.8,video.height*0.9);
        cv.rectangle(dst,pnt1, pnt2,[255,0,0,255],5);


        // generate certificer
            let classifier = new cv.CascadeClassifier();

        // load pre-trained classifiers
            let utils = new Utils('errorMessage');
            let url = 'https://github.com/opencv/opencv/raw/4.x/data/haarcascades/haarcascade_frontalface_default.xml';
            let faceCascadeFile = '/haarcascade_frontalface_default.xml'; // path to xml
            let faces = new cv.RectVector();
            // utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
            // classifier.load(faceCascadeFile); // in the callback, load the cascade from file 
            // })

            // // classifier.load('../haarcascade_frontalface_default.xml');
            // if(classifier.load('haarcascade_frontalface_default.xml'))
            // {
             
            // }else{
            // console.log("cascade not loaded");
            // }
            classifier = testLoad();

            classifier.detectMultiScale(dst, faces, 1.1, 3, 0);
            
            // draw faces.
            for (let i = 0; i < faces.size(); ++i) {
                let face = faces.get(i);
                let point1 = new cv.Point(face.x, face.y);
                let point2 = new cv.Point(face.x + face.width, face.y + face.height);
                cv.rectangle(dst, point1, point2, [0, 255, 0, 255], 5);
            
            if ((face.x >= pnt1.x)&&
                (face.y >= pnt1.y)&&
                (face.x + face.width <= pnt2.x)&&
                (face.y + face.height <= pnt2.y)){
                    
                cv.rectangle(dst,pnt1, pnt2,[0,255,0,255],5)	
                    
                }else{
                cv.rectangle(dst,pnt1, pnt2,[255,0,0,255],5)
                }
            }
        cv.imshow("canvasOutput", dst);
        // schedule next one.
        let delay = 1000/FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
}
// schedule first one.
    setTimeout(processVideo, 0);
}





function faceVideo(){
    
    let utils = new Utils('errorMessage');
    let canvasFrame = document.getElementById("canvasOutput"); // canvasFrame is the id of <canvas>
    let context = canvasFrame.getContext("2d");
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let gray = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let cap = new cv.VideoCapture(video);
    let faces = new cv.RectVector();
    let classifier = new cv.CascadeClassifier();

    classifier = testLoad();
    console.log(classifier);

    // // load pre-trained classifiers
    //     // // load pre-trained classifiers
    //     let utils = new Utils('errorMessage');

    //     let faceCascadeFile = 'haarcascade_frontalface_default.xml'; // path to xml
    //    let url = 'https://github.com/opencv/opencv/raw/4.x/data/haarcascades/haarcascade_frontalface_default.xml';
    //      utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
    //     classifier.load(faceCascadeFile); // in the callback, load the cascade from file 
    //     })

        // // classifier.load('../haarcascade_frontalface_default.xml');
        // if(classifier.load('haarcascade_frontalface_default.xml'))
        // {
        //     console.log('yes');
        // }else{
        // console.log("cascade not loaded");
        // }

    //check for classifier  

    // classifier.load('../haarcascade_frontalface_default.xml');

    // const FPS = 30;
    function processVideo() {
        try {
            if (false) {
                console.log('ok');
                // clean and stop.
                src.delete();
                dst.delete();
                gray.delete();
                faces.delete();
                classifier.delete();
                return;
            }
            let begin = Date.now();
            
            // start processing.
            cap.read(src);
            src.copyTo(dst);
            cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
            
            // sollbereich für das Gesicht
            let pnt1 = new cv.Point(video.width*0.2,video.height*0.1);
            let pnt2 = new cv.Point(video.width*0.8,video.height*0.9);
            cv.rectangle(dst,pnt1, pnt2,[255,0,0,255],5);
            
            
            // detect faces.
            classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
            
            // draw faces.
            for (let i = 0; i < faces.size(); ++i) {
                let face = faces.get(i);
                let point1 = new cv.Point(face.x, face.y);
                let point2 = new cv.Point(face.x + face.width, face.y + face.height);
                cv.rectangle(dst, point1, point2, [0, 255, 0, 255], 5);
            
            if ((face.x >= pnt1.x)&&
                (face.y >= pnt1.y)&&
                (face.x + face.width <= pnt2.x)&&
                (face.y + face.height <= pnt2.y)){
                    
                cv.rectangle(dst,pnt1, pnt2,[0,255,0,255],5)	
                    
                }else{
                cv.rectangle(dst,pnt1, pnt2,[255,0,0,255],5)
                }
            
            }
            cv.imshow('canvasOutput', dst);
            // schedule the next one.
        
            let delay = 1000/FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);
        } catch (err) {
            utils.printError(err);
        }
};

// schedule the first one.
setTimeout(processVideo, 0);
}

startVideo();