import { Component } from '@angular/core';

import * as io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import feathersSocketIOClient from '@feathersjs/socketio-client';
import feathersAuthClient from '@feathersjs/authentication-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ngfeather';
  constructor() {
    const socket = io('http://localhost:3030');
    const client = feathers();
    client.configure(feathersSocketIOClient(socket)).configure(
      feathersAuthClient({
        storage: window.localStorage,
      })
    );
    (async () => {
      await client.authenticate({
        strategy: 'local',
        email: 'hello@feathersjs.com',
        password: 'supersecret',
      });
      const messages = await client.service('messages').find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25,
        },
      });
      console.log(messages);
    })();
  }
}
