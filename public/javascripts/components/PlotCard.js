/**
 * Created by tylero on 3/23/17.
 */
import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';

import PlotTabs from './PlotTabs';


const PlotCard = () => {
  return (
    <Card >
      <CardTitle
        title="Temperature and Humidity Plots"
        subtitle="Card subtitle"
      />
      <CardText>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
        Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
        Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
      </CardText>
      <div style={{padding: "14px 24px 24px", margin: 0}}>
        <PlotTabs/>
      </div>
    </Card>
  );
};

export default PlotCard;