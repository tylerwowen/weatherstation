/**
 * Created by tylero on 3/27/17.
 */

const fetchMinutelyFor6HoursData = () => {
  fetch(buildMinutelyFor6HoursRequest())
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      throw new Error(`Status${res.status}`);
    })
    .then((rawData) => {
      let data = [formTemp(rawData.results), formHum(rawData.results)];
      console.log(data);
      Plotly.newPlot('6HourPlot', data);
    })
    .catch(console.error);
}

function buildMinutelyFor6HoursRequest() {

  let start = new Date();
  start.setHours(start.getHours()-6);
  let end = new Date();
  return `/temphum/start/${start.getTime()}/end/${end.getTime()}/granularity/min`;
}

function formTemp(data) {
  return formData('temperature', data);
}

function formHum(data) {
  return formData('humidity', data);
}

function formData(key, data) {
  let time = [];
  let value = [];
  for (let i = 0; i < data.length; i++) {
    time.push(new Date(data[i].timestamp));
    value.push(data[i][key]);
  }
  return {
    x: time,
    y: value,
    name: key,
    type: 'scatter'
  };
}

export default fetchMinutelyFor6HoursData;