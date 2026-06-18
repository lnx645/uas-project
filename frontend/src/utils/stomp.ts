import { Client } from '@stomp/stompjs';

const client = new Client({
    brokerURL: 'ws://localhost:8080/ws-comments',
    connectHeaders: {},
    debug: function (str) {
        console.log('STOMP Debug: ', str); 
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
});

client.onConnect = (frame) => {
    console.log('Sukses Terhubung ke STOMP!');
    
    // Contoh Subscribe
    client.subscribe('/topic/comments', (message) => {
        console.log('Ada komen baru:', JSON.parse(message.body));
    });
};

client.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

// Aktifkan koneksi
client.activate();