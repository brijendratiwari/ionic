import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { PetcloudApiService } from '../api/petcloud-api.service';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class ChatSocketService {

  constructor(
    private platform: Platform,
    private socket: Socket,
    public api: PetcloudApiService,
  ) {}

  connectSocket() {
    let jwt = localStorage.getItem("token");
    if(jwt) {
      this.socket.ioSocket.io.opts.query = { token: jwt };
      this.socket.connect();
    }
  }

  inItMessage(bookingId: string, userId: string){
    let socketArray = {
      id: bookingId,
      userId: userId
    }

    this.socket.emit('userData', socketArray);
    this.socket.emit('initial-messages', socketArray);
    this.socket.on("kicked", (data) => {
      this.api.showToast(data.msg, 2000, "bottom");
    });

    this.socket.on("new-message", (data) => {
      if(data.id != socketArray.id){
				return false;
			}
      this.socket.emit('initial-messages', socketArray);
    });

    this.socket.on("new-image", (data) => {
      if(data.id != socketArray.id){
				return false;
			}
      this.socket.emit('initial-messages', socketArray);
    });

  }

}