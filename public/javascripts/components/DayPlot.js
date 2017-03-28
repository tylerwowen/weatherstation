/**
 * Created by tylero on 3/27/17.
 */

const fetchDailyFor7DaysData = () => {
  fetch(buildHourlyFor24HoursRequest())
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      throw new Error(`Status${res.status}`);
    })
    .then((rawData) => {
      let data = [
        formHighTemp(rawData.results),
        formLowTemp(rawData.results),
        formAvgHum(rawData.results)
      ];
      console.log(data);
      Plotly.newPlot('7DayPlot', data);
    })
    .catch(console.error);
}

function buildHourlyFor24HoursRequest() {

  let start = new Date(Date.now()-7*24*60*60*1000);
  // TODO: date calculation may be wrong
  let end = new Date();
  return `/temphum/start/${start.getTime()}/end/${end.getTime()}/granularity/day`;
}

function formHighTemp(data) {
  return formData('highTemp', data);
}

function formLowTemp(data) {
  return formData('lowTemp', data);
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

export default fetchDailyFor7DaysData;