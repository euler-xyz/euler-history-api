const WebSocket = require('ws');
const {enablePatches, applyPatches} = require('immer');
const EulerHistoryClient = require("../src/EulerHistoryClient.js");

enablePatches();


let ec = new EulerHistoryClient({
               version: 'example code',
               endpoint: 'ws://ec2-34-240-240-47.eu-west-1.compute.amazonaws.com:8900',
               WebSocket,
               onConnect: () => {
                   console.log("CONNECTED");
               },
               onDisconnect: () => {
                   console.log("DISCONNECTED");
                   logs = {};
               },
             });

ec.connect();


let logs;

ec.sub({ cmd: 'sub', query: { topic: 'logs', limit: 10, }, }, (err, patch) => {
    if (err) {
        console.log(`ERROR: ${err}`);
        return;
    }

    for (let p of patch.result) p.path = p.path.split('/').filter(e => e !== '');
    logs = applyPatches(logs, patch.result);

    console.log("Logs", logs);
});
