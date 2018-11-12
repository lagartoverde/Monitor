import React from 'react';
import './Page.css';
import './Summary.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import Link from 'react-router-dom/Link';

export default class Summary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agents: [],
      ready: false
    }
    this.getAgents = this.getAgents.bind(this);
  }
  componentDidMount() {
    setInterval(this.getAgents, 100);
  }
  getAgents() {
    fetch('http://localhost:3000/api/agentes', {
      method: 'GET',
      mode: 'cors'
    })
    .then((response) => response.json())
    .then((json)=> {
      let ready = true;
      if(json.length === 0) ready = false;
      for(let agent of json) {
        if(!agent.ready) ready = false;
      }
      this.setState((prevState) => ({
        agents: json,
        ready
      }))
    })
  }
  prepareSimulation() {
    fetch('http://localhost:3000/prepare', {
      method: 'GET',
      mode: 'cors'
    })
  }
  render() {
    return (
      <div className='container'>
        <h1>Vista General</h1>
        <table>
          <tr>
            <th>IP</th>
            <th>Puerto</th>
            <th>Rol</th>
            <th>Preparado</th>
            <th>Productos</th>
          </tr>
          {this.state.agents.map((agent)=> (
            <tr>
              <td>{agent.ip}</td>
              <td>{agent.puerto}</td>
              <td>{agent.rol}</td>
              <td>{agent.ready ? <FontAwesomeIcon icon="check" /> : <FontAwesomeIcon icon="times" />}</td>
              <td>
                <Link to='/products/1'>
                  <FontAwesomeIcon icon="ellipsis-h" />
                </Link>
              </td>
            </tr>
          ))}
        </table>
        <div className='buttons'>
          <Button variant="contained" color="primary" onClick={this.prepareSimulation}> Preparar </Button>
          <Button variant="contained" color="secondary" disabled={!this.state.ready}> Lanzar </Button>
        </div>
      </div>
    )
  }
}