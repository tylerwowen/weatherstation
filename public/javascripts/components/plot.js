/**
 * Created by tylero on 3/23/17.
 */
"use strict";

let xmlHttp = new XMLHttpRequest();

xmlHttp.onreadystatechange = responseHandler;
xmlHttp.open("GET", buildRequest(), true);
xmlHttp.send();


function responseHandler() {
  "use strict";

  if (xmlHttp.readyState === 4) {
    let res = JSON.parse(xmlHttp.responseText);
    let data = [formTemp(res.results), formHum(res.results)];
    Plotly.newPlot('myDiv', data);
  }
}

function buildRequest() {

  let start = new Date();
  start.setHours(start.getHours()-6);
  let end = new Date();
  return `/temphum/start/${start.getTime()}/end/${end.getTime()}/granularity/min`;
}

function formTemp(data) {
  let time = [];
  let temp = [];
  for (let i = 0; i < data.length; i++) {
    time.push(new Date(data[i].timestamp));
    temp.push(data[i].temperature);
  }
  return {
    x: time,
    y: temp,
    type: 'scatter'
  };
}

function formHum(data) {
  let time = [];
  let hum = [];
  for (let i = 0; i < data.length; i++) {
    time.push(new Date(data[i].timestamp));
    hum.push(data[i].humidity);
  }
  return {
    x: time,
    y: hum,
    type: 'scatter'
  };
}