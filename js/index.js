'use strict';
let $ = (selector) => document.querySelector(selector);
var canvasHeight;
var canvasWidth;
let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
let cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame;

document.addEventListener ('DOMContentLoaded', () => {
    let canvas = $('#imageCanvas');    
    let context = canvas.getContext('2d');    
    canvasHeight = canvas.height;
    canvasWidth = canvas.width;
    let video = document.createElement ('video');
    let filter = 'none';
    let settingsMode = false

    let errMsg = addCamera ();
    if (errMsg) {
        alert (errMsg);
        return;
    }
    
    let canvasImage = document.createElement ('canvas');
    canvasImage.height = canvasHeight;
    canvasImage.width = canvasWidth;
    let contextImage = canvasImage.getContext('2d');
    contextImage.translate(0 , canvasHeight);
    contextImage.scale (1, -1);
    
    let imageAnalysis =  () => {
        contextImage.drawImage (video, 0, 0, canvasWidth, canvasHeight);
         
        let imageData = addFilter (contextImage.getImageData(0, 0, canvasWidth, canvasHeight), filter);
        context.putImageData(imageData, 0,0 ); 
        
    }
    
    var lastFrame = 0;
    function animationLoop(timeLoop) {     
        if (timeLoop - lastFrame > 32) {
            imageAnalysis ();
            lastFrame = timeLoop;
        }    
            requestAnimationFrame(animationLoop);
    } 
    
    function addCamera (){
        var front = false;
        let errMsg = null;
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            let constraints = { audio: false, video: {  width: {min: 1280, ideal: 1280, max: 1920 } , 
                                                        height: {min: 720, ideal: 720, max: 1080 } ,
                                                        facingMode: (front? "user" : "environment") } };
            navigator.mediaDevices.getUserMedia ( constraints).then ( (stream) => {
                video.src = URL.createObjectURL (stream);
                video.play ();
            });
        } else {
            errMsg = 'Device Not Supported // Dispositivo no Compatible';
        }
        return errMsg;
    }
    
      $('#btn-fullscreen').addEventListener ('click', () => { toggleFullScreen($('body'));});
      $('#btn-settings').addEventListener ('click', () => { 
          $('#modal-filter-settings').style.display = 'none';
          $('#modal-main-settings').style.display = 'flex';
          $('#modal-settings').style.display = $('#modal-settings').style.display =='block' ? 'none' : 'block';
        });
      $('#btn-filter').addEventListener ('click', () => { 
          $('#modal-main-settings').style.display = 'none';
          $('#modal-filter-settings').style.display = 'flex'; 
        });
      
        $('#btn-filter-none').addEventListener ( 'click', () =>{ filter = 'none'; $('#modal-settings').style.display='none'; });
        $('#btn-filter-silh').addEventListener ( 'click', () =>{ filter = 'silh'; $('#modal-settings').style.display='none'; });
        $('#btn-filter-bw').addEventListener ( 'click', () =>{ filter = 'bw'; $('#modal-settings').style.display='none'; });
        $('#btn-filter-neg').addEventListener ( 'click', () =>{ filter = 'negative'; $('#modal-settings').style.display='none'; });
        $('#btn-filter-test').addEventListener ( 'click', () =>{ filter = 'test'; $('#modal-settings').style.display='none'; });
        

      $('#btn-snapshot').addEventListener ('click', () => {
          settingsMode = $('#modal-settings').style.display!='none' ? true : false;
          if (settingsMode) return;
          let saveLink = document.createElement('a');
          saveLink.style.visibility = 'hidden';
          let myDate = new Date();
          let now = myDate.getDate() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getFullYear() + ' ' + myDate.getHours() + ' ' + (myDate.getMinutes()+ 1) + ' ' + (myDate.getSeconds()+ 1);          
          
          canvas.toBlob ((blob) => {
            saveLink.href = window.URL.createObjectURL(blob);
            saveLink.download = 'myBrowserPhoto ' + now + '.jpeg';
            saveLink.onclick = (event) => document.body.removeChild(event.target);
            saveLink.style.display = 'none';
            $('body').appendChild(saveLink);
            saveLink.click();    
          });

      });

    requestAnimationFrame(animationLoop);

});


