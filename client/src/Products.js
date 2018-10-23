import React from 'react';
import './Page.css';
import './Products.css';
import Button from '@material-ui/core/Button';
import withRouter from 'react-router-dom/withRouter';

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
  }
  componentDidMount() {
    this.setState((prevState) => ({
      items: [
        {
          nombre: 'Patatas',
          cantidad: 2
        },
        {
          nombre: 'Zanahorias',
          cantidad: 5
        },
        {
          nombre: 'Calabacines',
          cantidad: 3
        },
        {
          nombre: 'Berenjenas',
          cantidad: 7
        },
      ]
    }))
  }
  render() {
    return (
      <div className='container'>
        <h1>Productos</h1>
        <table>
          <tr>
            <th>Nombre</th>
            <th>Cantidad</th>
          </tr>
          {this.state.items.map((item) => (
            <tr>
              <td>{item.nombre}</td>
              <td>{item.cantidad}</td>
            </tr>
          ))}
        </table>
        <div className='button'>
          <Button variant="contained" onClick={this.props.history.goBack}>Back</Button>
        </div>
      </div>
    )
  }
}

export default withRouter(Products);