import React, { Component, lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalStyle } from "../theme/GlobalStyle.styled";
import Loader from "../components/Loader";

//Компонент с ленивой загрузкой должен рендериться внутри компонента Suspense,
// который позволяет нам показать запасное содержимое (например, индикатор загрузки)
// пока происходит загрузка ленивого компонента.
import Searchbar from "../components/Searchbar";
// const Searchbar = lazy(() => import("../components/Searchbar"));
const ImageGallery = lazy(() => import("../components/ImageGallery"));

export default class App extends Component {
  // состояние. публичное свойство state. свойство экземпляра. от свойств этого объекта зависит разметка
  state = {
    searchQuery: "",
    page: null,
    selectedOption: null,
  };

  //Метод записи в state, применили для записи в App из SearchBar то что записали в input и нажали на кнопку отправить
  handleSearchBarSubmit = (searchQuery, page) => {
    this.setState({
      searchQuery,
      page: 1,
    });
    // console.log(this.state.foundImgs);
  };
  //Метод записи в state, применили для записи в App из SearchBar то что выбрали в Select в данном случае PerPage
  // Создаём в родителе App функцию Callback handleSubmitPerPage. У неё есть входной параметр "selectedOption" передаваемый из Searchbar
  // этот параметр мы присваиваем в стейт нашего компонента, с помощью функции setState.
  handleSubmitPerPage = (selectedOption) => {
    this.setState(selectedOption);
  };
  render() {
    return (
      <>
        <ToastContainer autoClose={3000} />
        <GlobalStyle />
        <Suspense
          fallback={
            <div>
              Loading...
              <Loader />
            </div>
          }
        >
          <Searchbar
            onSubmit={this.handleSearchBarSubmit}
            //Передаём в дочерний компонент Searchbar элемент через атрибут(транзит пропса) onChangeApp функцию handleSubmitPerPage
            onChangeApp={this.handleSubmitPerPage}
          />
          <ImageGallery
            searchQuery={this.state.searchQuery}
            page={this.state.page}
            selectedOption={this.state.selectedOption}
          />
        </Suspense>
      </>
    );
  }
}
