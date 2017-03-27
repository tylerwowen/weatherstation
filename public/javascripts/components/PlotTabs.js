/**
 * Created by tylero on 3/23/17.
 */
import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import fetchData from './MinutePlot';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

const PlotTabs = () => {
  fetchData();
  return (
    <Tabs>
      <Tab label="6 Hours" >
        <div>
          <h2 style={styles.headline}>Minutely data collected in past 6 hours</h2>
          <div id="6HourPlot">
          </div>
        </div>
      </Tab>
      <Tab label="24 Hours" >
        <div>
          <h2 style={styles.headline}>Hourly data collected in past 24 hours</h2>
          <p>
            This is another example tab.
          </p>
        </div>
      </Tab>
      <Tab
        label="7 Days"
        data-route="/home"
      >
        <div>
          <h2 style={styles.headline}>Daily data collected in past 7 dyas</h2>
          <p>
            This is a third example tab.
          </p>
        </div>
      </Tab>
      <Tab label="Customized">
      </Tab>
    </Tabs>
  );
};


export default PlotTabs;
