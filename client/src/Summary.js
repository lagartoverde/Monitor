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
      agents: []
    }
  }
  componentDidMount() {
    this.setState((prevState) => ({
      agents: [
        {
          ip: '192.168.1.1',
          puerto: '80',
          rol: 'cliente',
          ready: true
        },
        {
          ip: '192.168.1.2',
          puerto: '80',
          rol: 'cliente',
          ready: true
        },
        {
          ip: '192.168.1.3',
          puerto: '80',
          rol: 'tienda',
          ready: false
        },
        {
          ip: '192.168.1.4',
          puerto: '80',
          rol: 'tienda',
          ready: true
        },
        {
          ip: '192.168.1.5',
          puerto: '80',
          rol: 'tienda',
          ready: false
        },
      ]
    }))
  }
  render() {
    return (
      <div className='container'>
        <h1>Summary</h1>
        <table>
          <tr>
            <th>IP</th>
            <th>Puerto</th>
            <th>Rol</th>
            <th>Ready</th>
            <th>Products</th>
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
          <Button variant="contained" color="primary"> Prepare </Button>
          <Button variant="contained" color="secondary"> Launch </Button>
        </div>
      </div>
    )
  }
}