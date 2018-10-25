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
  }
  componentDidMount() {
    this.setState((prevState) => ({
      logs: [
        {
          emisor: '192.168.1.1:80',
          receptor: '192.168.1.2:80',
          hora: '18:34:00',
          tipo: 'compra'
        },
        {
          emisor: '192.168.1.3:80',
          receptor: '192.168.1.4:80',
          hora: '18:34:10',
          tipo: 'pregunta'
        },
        {
          emisor: '192.168.1.7:80',
          receptor: '192.168.2.2:80',
          hora: '18:34:20',
          tipo: 'compra'
        },
        {
          emisor: '192.168.1.1:80',
          receptor: '192.168.1.2:80',
          hora: '18:34:34',
          tipo: 'salir'
        },
        {
          emisor: '192.168.1.15:80',
          receptor: '192.168.1.6:80',
          hora: '18:34:10',
          tipo: 'venta'
        },
      ]
    }))
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
                <Link to='/logs/1'>
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