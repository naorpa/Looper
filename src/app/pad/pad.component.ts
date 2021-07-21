import { Component, OnInit } from '@angular/core';
import { SAMPALES } from '../Sampales';
import { Pad } from '../Pad'
import * as path from 'path';
const baseUrl="../../assets/SampelsMusic/";
let audio;

@Component({
  selector: 'app-pad',
  templateUrl: './pad.component.html',
  styleUrls: ['./pad.component.css']
})
export class PadComponent implements OnInit {

  pads = SAMPALES;
  selected_first_Pad?: Pad;
  samples_length = SAMPALES.length;
  count_playing = 0;
  seconds_of_first: number;
  audios: Array<any> = [];
  time_slice: Array<any> = [];
  constructor() { }
  ngOnInit(): void {
    for (var i = 0; i < this.samples_length; i++) {
      var audio_music = new Audio();
      this.audios.push(audio_music);
    }
    for (var i = 0; i < this.samples_length; i++) {
      this.pads[i].state = false;
      var url = baseUrl + this.pads[i].src + ".mp3";
      this.audios[i].src = url;
    }
    this.count_playing = 0;
  }

  continueLoop(): void {
    for (var i = 0; i < this.time_slice.length; i++) {
      if (i % 2 == 0) {
        this.audios[this.time_slice[i]].play();
      }
    }
  }


  stopLoop(): void {
    for (var i = 0; i < this.samples_length; i++)
      this.audios[i].pause();

  }


  onSelect(pad: Pad): void {
    if (this.pads[pad.id].state == false) {
      this.PlayAudio(pad);

    }
    else {
      this.StopAudio(pad);
    }
  }
  PlayAudio(pad: Pad): void {
    if (this.count_playing == 0) {
      this.seconds_of_first = Date.now();
      this.selected_first_Pad = pad;
      this.time_slice.push(pad.id, this.seconds_of_first);
      this.Play(pad);

    }
    else {
      var time_now = Date.now();
      var time_to_next_round = (8000 - (time_now - this.seconds_of_first) % 8000);
      this.time_slice.push(pad.id, time_to_next_round + time_now);
      setTimeout(() => this.Play(pad), time_to_next_round);
    }
  }

  Play(pad: Pad): void {
    this.count_playing = this.count_playing + 1;
    this.pads[pad.id].state = true;
    this.audios[pad.id].loop = true;
    this.audios[pad.id].play();
  }
  record():void{

  }
  stopRecording():void{

  }
  StopAudio(pad: Pad): void {
    this.audios[pad.id].pause();
    this.audios[pad.id].loop = false;
    this.audios[pad.id].currentTime = 0;
    if (pad.id == this.time_slice[0]) //if we want to remove the first element of the loop
    {
      this.time_slice.shift();
      this.time_slice.shift();
      if (this.count_playing > 1)//current state 2 are playing
      {
        this.selected_first_Pad = this.time_slice[0];
        this.seconds_of_first = this.time_slice[1];//becuse we push couples
      }
    }
    else {//not the first element so only need to remove from the array
      var index_to_remove = this.time_slice.indexOf(pad.id);
      if (index_to_remove > -1) { //is exsist
        this.time_slice.splice(index_to_remove, 2);
      }
    }
    this.count_playing--;
    this.pads[pad.id].state = false;

  }
}
