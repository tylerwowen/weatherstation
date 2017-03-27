/**
 * Created by tylero on 3/27/17.
 */

// let xmlHttp = new XMLHttpRequest();

// xmlHttp.onreadystatechange = responseHandler;
// xmlHttp.open("GET", buildRequest(), true);
// xmlHttp.send();
const fetchData = () => {
  fetch(buildRequest())
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((rawData) => {
      let data = [formTemp(rawData.results), formHum(rawData.results)];
      console.log(data);
      Plotly.newPlot('6HourPlot', data);
    })
    .catch(console.error);
}

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

export default fetchData;