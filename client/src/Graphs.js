import React, { Component } from 'react'
import {RadialChart} from 'react-vis';
import {PieChart, Pie, Legend, Cell, ResponsiveContainer} from 'recharts';
import './Graphs.css';


export class Graphs extends Component {
  render() {
    const colorsFirstGraph = [
      '#feebe2',
      '#fcc5c0',
      '#fa9fb5',
      '#f768a1',
      '#c51b8a',
      '#7a0177',
    ]
    const dataFirstGraph = [ 
      {name: 'Peticion Compra', value: 200}, 
      {name: 'Venta Aceptada', value: 180},
      {name: 'Venta Rechazada', value: 20},
      {name: 'Comunicacion entre clientes', value: 50},
      {name: 'Entrada en tienda', value: 10},
      {name: 'Salida de tienda', value: 10},
    ]

    const colorsSecondGraph = [
      '#684C7D',
      '#92BDA3'
    ]
    const dataSecondGraph = [
      {name: 'Compras Realizadas', value: 180},
      {name: 'Compras Fallidas', value: 20}
    ]

    const colorThirdGraph = [
      '#FD6C68',
      '#AFB076'
    ]
    const dataThirdGraph = [
      {name: 'Compradores', value: 10},
      {name: 'Tiendas', value: 30}
    ]
    return (
      <div className='graphs-container'>
        <div>
          <h1>Tipo de Mensaje</h1>
          <div class='graph'>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={dataFirstGraph} dataKey="value" nameKey="name" cx="50%" cy="50%" label={this.customizedLabel}>
                  {dataFirstGraph.map((entry, index)=> 
                    <Cell fill={colorsFirstGraph[index % colorsFirstGraph.length]}/>
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h1>Compras</h1>
          <div class='graph'>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={dataSecondGraph} dataKey="value" nameKey="name" cx="50%" cy="50%" label={this.customizedLabel}>
                  {dataSecondGraph.map((entry, index)=> 
                    <Cell fill={colorsSecondGraph[index % colorsSecondGraph.length]}/>
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h1>Agentes</h1>
          <div class='graph'>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={dataThirdGraph} dataKey="value" nameKey="name" cx="50%" cy="50%" label={this.customizedLabel}>
                  {dataSecondGraph.map((entry, index)=> 
                    <Cell fill={colorThirdGraph[index % colorThirdGraph.length]}/>
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h1>Compras</h1>
          <div class='graph'>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={dataThirdGraph} dataKey="value" nameKey="name" cx="50%" cy="50%" label={this.customizedLabel}>
                  {dataSecondGraph.map((entry, index)=> 
                    <Cell fill={colorThirdGraph[index % colorThirdGraph.length]}/>
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    )
  }
  customizedLabel({name, value}) {
    return `${name} (${value})`;
  }
}

export default Graphs
