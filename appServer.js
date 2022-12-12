// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
require('dotenv').config();     // used to load values from .env file
const app = require('express')(); // express is a web application freamwork in javascript
// import { v4 as uuidv4 } from 'uuid';    // to generate a uninque user id
// const uuidv4 = require('uuid');


// Initialize the express app
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
}));

const MY_API_KEY = "4243781";
const MY_API_SECREAT = "b4b9476730c84fbcd66fe757a44c47a08b9808f4";

const MY_PORT = process.env.PORT || 3000;

const OpenTok = require('opentok');
// const OT = new OpenTok(process.env.API_KEY, process.env.API_SECRET);
const OT = new OpenTok(MY_API_KEY, MY_API_SECREAT);

let serviceType;

// const OT_CLIENT = require('@opentok/client');

// let myPath = '/';
app.get('/', function (request, response) {
  console.log("GET request to Home OR /");
  // console.log('YOUR PATH: ' + myPath);
  response.sendFile(__dirname + '/views/index.html');
});

app.post('/session/:name', function (request, response) {
  const name = request.params.name;
  let serviceType = request.params.serviceType;
  // console.log("UName: "+ name + " Servi Type: "+ serviceType);

  if (sessions[name]) {   //check the session if it exist
    const token = OT.generateToken(sessions[name], {
      role: 'publisher',
      data: 'roomname=' + name
    })

    response.send({
      sessionId: sessions[name],
      apiKey: MY_API_KEY,
      token: token        //is vary
    })
  }
  else {
    OT.createSession(function (error, session) {
      if (error) {
        console.log('Error on Creating Session: ' + error);
      }

      // returning session
      sessions[name] = session.sessionId;
      const token = OT.generateToken(sessions[name], {
        role: 'publisher',
        data: 'roomname=' + name
      })
      // returning all active sessionID
      console.log(sessions);

      response.send({
        sessionId: sessions[name],
        apiKey: MY_API_KEY,
        token: token
      });
    })
  }
})

// the name and serviceType are dynamic
app.get('/session/:name', function (request, response) {
  // const serviceType = request.params.serviceType.toLowerCase();
  console.log('GET request to /session/' + request.params.name);
  // console.log('GET request to /session/' + request.params.name + '/' + request.params.serviceType);
  // myPath = '/session/' + request.params.name;
  // console.log('YOUR PATH: ' + myPath);
  response.sendFile(__dirname + `/views/${serviceType}.html`);
  // if (serviceType === 'video') {
  //   response.send({
  //     ServiceType: serviceType
  //   });
  //   // response.sendFile(__dirname + '/views/audio_video.html');
  // }
  // if (serviceType === "audio") {
  //   response.send({
  //     ServiceType: serviceType
  //   });
  //   // response.sendFile(__dirname + '/views/audio.html');
  // }
});

// setting here all active sessions
let sessions = {};
let tokens = {};

app.get('/session/:name/ready_for_service/:userType', function (request, response) {
  console.log('GET request to /ready_for_service/' + request.params.userType);
  // console.log('YOUR PATH: ' + myPath + '/ready_for_service/' + request.params.userType);
  response.send(`</html>
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recived Message</title>
  </head>
  <body>
  <h1>Please wait for a few minutes...</h1>
    <h2>Your UserName: ${request.params.name}</h2>
    <h2>Your UserType: ${request.params.userType}</h2>  
  </body>
  </html>` );
});

app.post('/session/:name/ready_for_service/:userType', function (request, response) {
  // console.log('YOUR PATH: ' + myPath + '/ready_for_service/');
  console.log('GET request to /ready_for_service/' + request.params.userType);
  response.send({
    userName: request.params.name,
    userType: request.params.userType,
  });
});

let allRequest = [];
app.post('/registerUser/:data', function (req, res) {
  
  // const data = req.params.data;
  const data = req.body;

  console.log("Call Maker DATA==>>>>> " + data);
  //  cast the recived JSON Object to Javascript Object
  const myObj = JSON.parse(data);
  let serviceType = myObj.serviceType;
  let requestID = myObj.requestID;
  console.log("Service_Type>: " + serviceType);

  if (serviceType.toLowerCase() == "audio") {
    console.log("Recived AUDIO request");
    
    res.sendFile(__dirname + '/views/index.html');
  }
  if (serviceType.toLowerCase() == "video") {
    console.log("Recived VIDEO request");
    res.sendFile(__dirname + '/views/index.html');
  }
    // res.send({
    //   // sessionId: sessions[name],
    //   apiKey: MY_API_KEY,
    //   Your_DATA: serviceType,
    //   MEthod: "GET",
    //   Data: myObj
    // });
})




app.get('/registerUser/:data', function (request, response) {
  const data = request.params.data;

  console.log("<<<<<=== Call Maker DATA==>>>>> " + data);
  console.log("Call Maker DATA==>>>>> " + data);
  // {"requestID":"f3ab71b38af89486d5c1b10ec191bc47","usertype":"call_maker","serviceType":"audio_video","url":""}

  //  cast the recived JSON Object to Javascript Object
  const myObj = JSON.parse(data);
  serviceType = myObj.serviceType;
  let requestID = myObj.requestID;
  console.log("Service_Type>>>>>>  : " + serviceType);

  if (serviceType.toLowerCase() == "audio") {
    console.log("Recived AUDIO-CALL request");   
    response.sendFile(__dirname + `/views/index.html`);
  }
  if (serviceType.toLowerCase() == "audio_video") {
    console.log("Recived AUDIO-VIDEO-CALL request");
    response.sendFile(__dirname + `/views/index.html`);
  }  if (serviceType.toLowerCase() == "video") {
    console.log("Recived VIDEO request");
    response.sendFile(__dirname + `/views/index.html`);
  }

})
app.get('/registerUser', function (req, res) {
  const data = ['DEMO', 2];

  res.send({
    // sessionId: sessions[name],
    apiKey: MY_API_KEY,
    Your_DATA: "allRequest",
    MEthod: "POST"
    // token: token
  });
})


// app.post('/archiveStarted', (request, response) => {
//   // var archiveID = request.params('archiveID');

//   var hasAudio = (req.param('hasAudio') !== undefined);
//   var hasVideo = (req.param('hasVideo') !== undefined);
//   var outputMode = req.param('outputMode');
//   var archiveOptions = {
//     name: 'Addis Ababa Police Information Archive',
//     hasAudio: hasAudio,
//     hasVideo: hasVideo,
//     outputMode: outputMode
//   };
//   if (outputMode === 'composed') {
//     archiveOptions.layout = { type: 'horizontalPresentation' };
//   }
//   opentok.startArchive(app.get('sessionId'), archiveOptions, function (err, archive) {
//     if (err) {
//       return res.send(
//         500,
//         'Could not start archive for session ' + app.get('sessionId') + '. error=' + err.message
//       );
//     }
//     console.log("WOW");
//     return res.json(archive);
//     console.log("WWW");
//   });
// });

// app.get('/archiveStopped', (request, response) => {
//   const { archiveID } = request.body;

//   OT.stopArchive(archiveID, (error, archive) => {
//     if (error) {
//       return err.status(400).send("There was an error on stoping archive!");
//     } else {
//       response.json(archive);
//     }
//   });
// });


















// The Client Module
// const publisherClient = OT_CLIENT.initPublisher();
// let publishMyVideoFootage = true;
// var pubVideoOptions = { publishAudio: true, publishVideo: true };
// var subscriberLayout = { insertMode: "append", width: "100%", height: "100%" };

// let myClientSessions = {};
// let myClientSession = OT_CLIENT.initSession(data.apiKey, data.sessionId);
// // console.log(session);
// // let name = location.pathname;
// let name;
// myClientSessions[name] = myClientSession.sessionId;

// // function videoStreaming() {
// publisherClient = OT_CLIENT.initPublisher("publisherID", pubVideoOptions);
// // CM_Publisher.callMaker = publisher;
// myClientSession.connect(data.token, function () {
//   myClientSession.publish(publisherClient);
// });

// // Session listening for the events
// myClientSession.on("streamCreated", function (event) {
//   myClientSession.subscribe(event.stream, "subscriberID", {
//     insertMode: "append",
//     width: "100%",
//     height: "100%",
//   });
//   // CT_Subscriber.callTaker = event.stream;
//   // const sessionId = session.sessionId;
// });




















app.listen(MY_PORT, function () {
  console.log("The server is runnining well on port " + MY_PORT);
});
