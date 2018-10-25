import React from 'react';
import './Page.css';
import './LogDetails.css';
import beautify from 'xml-beautifier';
import Button from '@material-ui/core/Button';
import withRouter from 'react-router-dom/withRouter';

class LogDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      log: ''
    }
  }
  componentDidMount() {
    this.setState((prevState) => ({
      log: ` 
      <mensaje>
      <emisor>
        <direccion>
          <ip>192.168.1.1</ip>
          <puerto>80</puerto>
        </direccion>
        <rol>Monitor</rol>
      </emisor>
      <receptor>
        <direccion>
          <ip>192.168.1.2</ip>
          <puerto>80</puerto>
        </direccion>
        <rol>Comprador</rol>
      </receptor>
      <tipo>inicializacion</tipo>
      <cuerpo>
        <listaCompra>
          <producto>
            <nombre>producto1</nombre>
            <cantidad>2</cantidad>
          </producto>
          <producto>
            <nombre>producto2</nombre>
            <cantidad>3</cantidad>
          </producto>
          <producto>
            <nombre>producto4</nombre>
            <cantidad>1</cantidad>
          </producto>
          <producto>
            <nombre>producto5</nombre>
            <cantidad>6</cantidad>
          </producto>
        </listaCompra>
        <listaTiendas>
          <tienda>
            <direccion>
              <ip>192.168.1.3</ip>
              <puerto>80</puerto>
            </direccion>
          </tienda>
        </listaTiendas>
      </cuerpo>
    </mensaje>
    `
    }))
  }
  render() {
    return (
      <div className='container'>
        <h1>Logs</h1>
        <pre lang='xml'>{beautify(this.state.log)}</pre>
        <div className='button'>
          <Button variant="contained" onClick={this.props.history.goBack}>Back</Button>
        </div>
      </div>
    )
  }
}

export default withRouter(LogDetails);