import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  socket = new WebSocket('ws://localhost:4600/thisismyauthentication');

  constraints = {
    audio: true,
    video: true
  }

  @ViewChild('videoShow') videoElem: ElementRef<HTMLVideoElement>;


  constructor() { }

  async ngOnInit() {

    try {
      console.log(this.socket);

      // this.navigatorFunction()

      // Connection opened
      this.socket.addEventListener('open', (event) => {
        // setInterval(() => {
        this.socket.send('Hello Server!');
        // }, 1200)
      });

      // Listen for messages
      this.socket.addEventListener('message', (event) => {
        console.log('Message from server ', event.data);
      });

    } catch (err) {
      console.error(err);
    }
  }

  async demoForWebRtc() {
    try {

      const lc = new RTCPeerConnection();

    } catch (err) {
      console.error(err);
    }
  }


  



  async navigatorFunction() {
    try {
      if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia(this.constraints).then((val) => {
          console.log(val);
          if ('srcObject' in this.videoElem.nativeElement) {
            // console.log('hahahha');
            this.videoElem.nativeElement.srcObject = val;
          } else {
            console.log('having some kind of problem');
            // this.videoElem.nativeElement = window.URL.createObjectURL(val) as any;
          }

          this.videoElem.nativeElement.onloadedmetadata = (ev) => {
            this.videoElem.nativeElement.play()
          }
        }).catch((err) => {
          console.error(err);
        })
      } else {
        console.log('i am  up guys');
      }
    } catch (err) {
      console.error(err);
    }
  }

}
