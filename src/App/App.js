import React, { Component } from "react";

import { GlobalStyle } from "../theme/GlobalStyle.styled";

class App extends Component {
  // состояние. публичное свойство state. свойство экземпляра, всегда объект. от свойств этого объекта зависит разметка
  state = {};

  render() {
    return (
      <>
        <GlobalStyle />
        <h3>goit-react-hw-03-image-finder</h3>
      </>
    );
  }
}

export default App;
