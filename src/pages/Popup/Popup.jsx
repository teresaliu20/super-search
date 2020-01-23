import React, { Component } from 'react';
import SearchContainer from '../../containers/Search/Search';
import './Popup.css';

class Popup extends Component {
  render() {
    return (
      <div>
        <h1>This is the Popup Window</h1>
        <div>
          <SearchContainer />
        </div>
      </div>
    );
  }
}

export default Popup;
