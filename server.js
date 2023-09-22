import express from 'express';
import server from 'http';

let public_server = express();

// Server Public Folder
public_server.use('/', express.static('public'));

server.createServer(public_server).listen(80, () => {
    console.log('Server running on port http://localhost:80');
});