import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from '../database/database.service';
declare var MediaRecorder: any;


export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {

  stream;
  @ViewChild('videoSrc') videoSrc: ElementRef<HTMLVideoElement>;
  @ViewChild('audioSrc') audioSrc: ElementRef<HTMLAudioElement>;

  constraints = {
    video: {
      cursor: "always"
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100
    }
  }


  folders: Section[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    }
  ];
  notes: Section[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    }
  ];
  constructor(private dbConnection: DatabaseService) { }

  ngOnInit(): void {
  }


  async askForConfirmation() {
    try {


      console.log(navigator.mediaDevices.getSupportedConstraints());
      const mediaDevices = navigator.mediaDevices as any;

      const chunks = [];
      // console.log(await navigator.mediaDevices.enumerateDevices())

      const videoStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      })


      const stream = await mediaDevices.getDisplayMedia({
        video: {
          cursor: "always"
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      console.log(stream.getVideoTracks(), 'Audio Tracks');


      const updatedStream = new MediaStream([...videoStream.getAudioTracks(), ...stream.getVideoTracks()])


      var audioRecorder = new MediaRecorder(videoStream);
      var recorder = new MediaRecorder(stream);
      var updatedRecorder = new MediaRecorder(updatedStream);

      recorder.addEventListener('dataavailable', (e) => {
        console.log(e);
        updatedRecorder.stop();
        // this.writingIntoDB(e.data);
        // this.videoSrc.nativeElement.src = URL.createObjectURL(e.data);
        // audioRecorder.stop();
        // e.data contains the audio data! let's associate it to an <audio> element
        // var el = document.querySelector('audio');
        // el.src = URL.createObjectURL(e.data);
      });

      updatedRecorder.addEventListener('dataavailable', (e) => {
        console.log(e);
        // this.writingIntoDB(e.data);
        this.videoSrc.nativeElement.src = URL.createObjectURL(e.data);
        audioRecorder.stop();
        // e.data contains the audio data! let's associate it to an <audio> element
        // var el = document.querySelector('audio');
        // el.src = URL.createObjectURL(e.data);
      });




      console.log('hahahah');

      audioRecorder.addEventListener('dataavailable', (e) => {
        console.log(e);
        // this.writingIntoDB(e.data);
        this.audioSrc.nativeElement.src = URL.createObjectURL(e.data);
        // e.data contains the audio data! let's associate it to an <audio> element
        // var el = document.querySelector('audio');
        // el.src = URL.createObjectURL(e.data);
      });

      console.log('Ready steady go');

      recorder.addEventListener('stop', (e) => {
        console.log('It has been stopped', e);
      })

      // start recording here...
      recorder.start();
      audioRecorder.start();
      updatedRecorder.start();

    } catch (err) {
      console.error(err);
    }
  }


  playerStopped() {

  }

  async writingIntoDB(file: Blob) {
    try {

      const doTheProcess = await this.dbConnection.writeIntoDatabase('files', {
        name: `Sukhdeep-${new Date().getTime()}`,
        age: 28,
        gender: 'Male',
        some: 'Another',
        file
      });

      console.log(doTheProcess);
    } catch (err) {
      console.error(err);
    }
  }

}
