/**
 * Created by tylero on 3/26/17.
 */

import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

import PlotCard from './PlotCard';

const style = {
  wrapper: {
    // Avoid IE bug with Flexbox, see #467
    display: 'flex',
    flexDirection: 'column'
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  body: {
    backgroundColor: '#edecec',
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  }
};

class App extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <MuiThemeProvider>
        <div style={style.wrapper}>
          <AppBar
            title="Pi Weather Station"
            style={{ "textAlign": "center"}}
            showMenuIconButton={false}
          />
          <div style={{padding: "2em"}}>
            <PlotCard />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
