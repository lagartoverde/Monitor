import React, { Component } from 'react'
import {RadialChart} from 'react-vis';
import {PieChart, Pie, Legend, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import './Graphs.css';


export class Graphs extends Component {
  render() {
    const colorsFirstGraph = [
      '#EF65FD',
      '#E819FD',
      '#B34CBE',
      '#A211B0',
      '#730C7D',
      '#730C90',
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
      '#72B089',
      '#C5473B'
    ]
    const dataSecondGraph = [
      {name: 'Compras Realizadas', value: 180},
      {name: 'Compras Fallidas', value: 20}
    ]

    const colorThirdGraph = [
      '#294552',
      '#9eb9b3'
    ]
    const dataThirdGraph = [
      {name: 'Compradores', value: 10},
      {name: 'Tiendas', value: 30}
    ]

    const dataFourthGraph = [
      {name: '0:00', "compras realizadas": 5, "compras fallidas": 1},
      {name: '0:05', "compras realizadas": 7, "compras fallidas": 2},
      {name: '0:10', "compras realizadas": 3, "compras fallidas": 0},
      {name: '0:15', "compras realizadas": 10, "compras fallidas": 2},
      {name: '0:20', "compras realizadas": 20, "compras fallidas": 1},
      {name: '0:25', "compras realizadas": 7, "compras fallidas": 0},
      {name: '0:30', "compras realizadas": 12, "compras fallidas": 3},
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
            <AreaChart data={dataFourthGraph}>
              <defs>
              <linearGradient id="colorRealizadas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFallidas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C5473B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#C5473B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="compras realizadas" stroke="#82ca9d" fillOpacity={1} fill="url(#colorRealizadas)" />
              <Area type="monotone" dataKey="compras fallidas" stroke="#82ca9d" fillOpacity={1} fill="url(#colorFallidas)" />
            </AreaChart>
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
