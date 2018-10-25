import React from 'react';
import './Page.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'react-router-dom/Link';

export default class Logs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: []
    }
    this.getLogs = this.getLogs.bind(this);
  }
  componentDidMount() {
    setInterval(this.getLogs, 100);
  }
  getLogs() {
    fetch('http://localhost:3000/api/logs', {
      method: 'GET',
      mode: 'cors'
    })
    .then((response) => response.json())
    .then((json)=> {
      this.setState((prevState) => ({
        logs: json
      }))
    })
  }
  render() {
    return (
      <div className='container'>
        <h1>Logs</h1>
        <table>
          <tr>
            <th>Emisor</th>
            <th>Receptor</th>
            <th>Hora</th>
            <th>Tipo</th>
            <th>Detalles</th>
          </tr>
          {this.state.logs.map((log)=> (
            <tr>
              <td>{log.emisor}</td>
              <td>{log.receptor}</td>
              <td>{log.hora}</td>
              <td>{log.tipo}</td>
              <td>
                <Link to={`/logs/${log.id}`}>
                  <FontAwesomeIcon icon="ellipsis-h" />
                </Link>
              </td>
            </tr>
          ))}
        </table>
      </div>
    )
  }
}