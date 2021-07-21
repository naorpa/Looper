import { Component } from '@angular/core';

import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from "@angular/platform-browser";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Looper App';


 record;

 recording = false;

 url;
 error;
constructor(private domSanitizer: DomSanitizer) {
}
sanitize(url:string){
   return this.domSanitizer.bypassSecurityTrustUrl(url);
}

initiateRecording() {
   this.recording = true;
   let mediaConstraints = {
       video: false,
       audio: true
   };
   navigator.mediaDevices
       .getUserMedia(mediaConstraints)
       .then(this.successCallback.bind(this), this.errorCallback.bind(this));
}

successCallback(stream) {
   var options = {
       mimeType: "audio/wav",
       numberOfAudioChannels: 1
   };

   var StereoAudioRecorder   = RecordRTC.StereoAudioRecorder  ;
   this.record = new StereoAudioRecorder (stream, options);
   this.record.record();
}

stopRecording() {
   this.recording = false;
   this.record.stop(this.processRecording.bind(this));
}
/**
* processRecording Do what ever you want with blob
* @param  {any} blob Blog
*/
processRecording(blob) {
   this.url = URL.createObjectURL(blob);
}

errorCallback(error) {
   this.error = 'Can not play audio in your browser';
}
  }
