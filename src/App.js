import React, { Component } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import AreaLineChart from './components/AreaLineChart'

class App extends Component {
  render() {
    return (
      <div className="App container-fluid">
        <h1>D3 Chart Playground</h1>
        <div className="row">
          <div className="col-sm-4">
            <AreaLineChart />
          </div>
        </div>
      </div>
    )
  }
}

export default App
