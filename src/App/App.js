import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalStyle } from "../theme/GlobalStyle.styled";
import Searchbar from "../components/Searchbar";
import ImageGallery from "../components/ImageGallery";

export default class App extends Component {
  // состояние. публичное свойство state. свойство экземпляра, всегда объект. от свойств этого объекта зависит разметка
  state = {
    foundImgs: "",
    query: "",
  };

  // componentDidMount() {
  //   const API_KEY = "24457855-696bd2eff11a5d8607ee7122f";
  //   const searchName = this.state.foundImgs;
  //   fetch(
  //     `https://pixabay.com/api/?q=${searchName}&page=1&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
  //   )
  //     .then((res) => res.json())
  //     .then((foundImgs) => this.setState({ foundImgs }));
  // }

  //Метод для получения и записи в state App из SearchBar то что записали в input и отправили
  handleSearchBarSubmit = (foundImgs) => {
    // console.log(query);
    this.setState({ foundImgs });
  };

  render() {
    return (
      <>
        <ToastContainer autoClose={3000} />
        <GlobalStyle />
        <h3>goit-react-hw-03-image-finder</h3>
        {this.state.foundImgs && <div>{this.state.foundImgs.totalHits}</div>}
        <Searchbar onSubmit={this.handleSearchBarSubmit} />
        <ImageGallery foundImgs={this.state.foundImgs} />
      </>
    );
  }
}
