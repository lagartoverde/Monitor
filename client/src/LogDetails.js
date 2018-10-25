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
    this.getLog = this.getLog.bind(this)
  }
  componentDidMount() {
    this.getLog()
  }
  getLog(){
    fetch(`http://localhost:3000/api/logs/${this.props.match.params.id}`, {
      method: 'GET',
      mode: 'cors'
    })
    .then((response) => response.json())
    .then((json)=> {
      this.setState((prevState) => ({
        log: json.mensaje
      }))
    })
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