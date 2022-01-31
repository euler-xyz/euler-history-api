const WebSocket = require('ws');
const {enablePatches, applyPatches} = require('immer');
const EulerScanClient = require("../src/EulerScanClient.js");

enablePatches();


let ec = new EulerScanClient({
               version: 'example code',
               endpoint: 'wss://escan-mainnet.euler.finance',
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

ec.sub({ cmd: 'sub', query: { topic: 'logs', limit: 100, offset: 0, }, }, (err, patch) => {
    if (err) {
        console.log(`ERROR: ${err}`);
        return;
    }

    for (let p of patch.result) p.path = p.path.split('/').filter(e => e !== '');
    logs = applyPatches(logs, patch.result);

    console.log(logs);
});
