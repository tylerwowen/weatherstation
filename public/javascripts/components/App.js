/**
 * Created by tylero on 3/26/17.
 */

import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const color = Math.random() > 0.5 ? 'green' : 'red';

class App extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <MuiThemeProvider>
        <div></div>
      </MuiThemeProvider>
    );
  }
}

export default App;
