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
    this.getProducts = this.getProducts.bind(this)
  }
  componentDidMount() {
    this.getProducts()
  }

  getProducts(){
    fetch(`http://localhost:3000/api/products/${this.props.match.params.id}`, {
      method: 'GET',
      mode: 'cors'
    })
    .then((response) => response.json())
    .then((json)=> {
      this.setState((prevState) => ({
        items: json
      }))
    })
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