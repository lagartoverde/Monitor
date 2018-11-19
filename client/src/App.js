import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './Header';
import Summary from './Summary';
import Products from './Products';
import Logs from './Logs';
import LogDetails from './LogDetails';
import Graphs from './Graphs';
import { BrowserRouter as Router, Route} from "react-router-dom";
import Switch from 'react-router-dom/Switch';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <Router>
          <div className='route'>
            <Switch>
              <Route exact path='/' component={Summary} />
              <Route path='/products/:id' component={Products} />
              <Route exact path='/logs' component={Logs} />
              <Route path='/logs/:id' component={LogDetails} />
              <Route path='/graphs' component={Graphs} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
