/**
 * Created by tylero on 3/27/17.
 */

const fetchHourlyFor24HoursData = () => {
  fetch(buildHourlyFor24HoursRequest())
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      throw new Error(`Status${res.status}`);
    })
    .then((rawData) => {
      let data = [formAvgTemp(rawData.results), formAvgHum(rawData.results)];
      console.log(data);
      Plotly.newPlot('24HourPlot', data);
    })
    .catch(console.error);
}

function buildHourlyFor24HoursRequest() {

  let start = new Date();
  start.setHours(start.getHours()-24);
  let end = new Date();
  return `/temphum/start/${start.getTime()}/end/${end.getTime()}/granularity/hour`;
}

function formAvgTemp(data) {
  return formData('avgTemp', data);
}

function formAvgHum(data) {
  return formData('avgHum', data);
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

export default fetchHourlyFor24HoursData;