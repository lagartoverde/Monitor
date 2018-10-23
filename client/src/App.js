import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './Header';
import Summary from './Summary';
import Products from './Products';
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
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
