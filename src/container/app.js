import React, { Component } from 'react';
import Multiselect from '../component/multiselect.component';
import '../css/app.css';

class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.options = [{key:'101',text:'Calendar',isChecked:false},{key:'102',text:'Ninjas',isChecked:false}]
      }

  render() {
    return (
      <div className="App">
            <Multiselect options={this.options}/>
      </div>
    );
  }
}

export default App;
