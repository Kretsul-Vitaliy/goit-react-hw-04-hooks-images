import React, { Component, lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalStyle } from "../theme/GlobalStyle.styled";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import FetchPixabayAPI from "../services/PixabayAPI";
import Modal from "../components/Modal";
//Компонент с ленивой загрузкой должен рендериться внутри компонента Suspense,
// который позволяет нам показать запасное содержимое (например, индикатор загрузки)
// пока происходит загрузка ленивого компонента.
import Searchbar from "../components/Searchbar";
const ImageGallery = lazy(() => import("../components/ImageGallery"));

export default class App extends Component {
  state = {
    searchQuery: "",
    page: null,
    perPage: null,
    searchImageArray: [],
    error: null,
    status: "idle",
    totalPages: null,
    totalHits: null,
    showLoader: false,
    isModalOpen: false,
    modalImage: "",
  };
  componentDidMount(event) {
    this.setState({ perPage: 12 });
  }
  async componentDidUpdate(prevProps, prevState) {
    const PrevName = prevState.searchQuery;
    const NextName = this.state.searchQuery;
    const PerPage = this.state.perPage;
    const NextPage = this.state.page;
    const PrevPage = prevState.page;

    try {
      if (PrevName !== NextName) {
        await this.setState({
          searchImageArray: [],
          page: NextPage,
          perPage: PerPage,
          showLoader: true,
        });
        await this.searchPictures();
        toast.success(
          await `Найдено ${this.state.totalHits} изображений ${NextName}`,
          { delay: 200 }
        );
      }
      if (NextPage !== PrevPage && NextPage !== 1) {
        await this.setState({
          perPage: PerPage,
          showLoader: true,
        });
        await this.searchPictures();
        //scrollBy прокрутит в нижней точке список
        //scrollTo прокрутит в верхней точке список
        await window.scrollBy({
          //   top: document.documentElement.scrollHeight, //прокрутит весь документ в конец
          top: 550,
          behavior: "smooth",
        });
        if (this.state.searchImageArray.length >= this.state.totalHits) {
          return await toast.info(
            `Сожалеем, но вы достигли конца списка \n результатов поиска по ${NextName}.`
          );
        }
      }
    } catch (error) {
      //   console.log(error);
    }
  }
  searchPictures = async () => {
    const NextName = this.state.searchQuery;
    const NextPage = this.state.page;
    const PerPage = this.state.perPage;
    const PicturesArray = FetchPixabayAPI(NextName, NextPage, PerPage);
    // console.log(PicturesArray); // promise
    // PicturesArray.then((resolve) => console.log("HITS", resolve.hits));    // resolve результат промиса вытягиваем обьект
    // const TEST = FetchPixabayAPI("cat", 10, 12); //выполнение функции с введенными данными
    // TEST.then((res) => console.log("HITS", res.hits)); //вытягиваем из функции обьекта, обьект с данными hits
    // TEST.then((res) => console.log("TOTAL", res.total)); //вытягиваем из функции обьекта значение total
    // TEST.then((res) => console.log("TOTALHITS", res.totalHits)); //вытягиваем из функции обьекта значение totalHits

    await PicturesArray.then((resolve) => {
      const picturesArray = resolve.hits.map(
        ({ id, tags, webformatURL, largeImageURL }) => {
          return { id, tags, webformatURL, largeImageURL };
        }
      ); // вытягиваем из массива нужные данные для создания нового массива с данными которые будем использовать
      // console.log("picturesArray", picturesArray);

      //первый вариант записи
      //   this.setState((prevState) => ({
      //     searchImageArray: [...prevState.searchImageArray, ...picturesArray],
      //   }));
      //   this.setState({
      //     status: "resolved",
      //     error: null,
      //     // resolve.totalHits - переменная количества найденных фото для API это максимальное количество
      //     totalHits: resolve.totalHits,
      //     totalPages: Math.ceil(resolve.totalHits / PerPageState), //получаем общее количество страниц
      //   });

      //второй вариант записи с одним setState
      this.setState((prevState) => {
        return {
          status: "resolved",
          showLoader: false,
          searchImageArray: [...prevState.searchImageArray, ...picturesArray],
          error: null,
          // resolve.totalHits - переменная количества найденных фото для API это максимальное количество
          totalHits: resolve.totalHits,
          totalPages: Math.ceil(resolve.totalHits / PerPage), //получаем общее количество страниц
        };
      });

      if (picturesArray.length === 0) {
        // return toast.error("There is no picture with that name!");
        return Promise.reject(new Error(`Try another name: ${NextName}`));
      }
    }).catch((error) =>
      this.setState({ status: "rejected", error: error.message })
    );
  };

  //Метод записи в state, применили для записи в App из SearchBar то что записали в input и нажали на кнопку отправить
  handleSearchBarSubmit = async (event, prevState) => {
    await event.preventDefault();
    await this.setState({
      searchQuery: event.target.searchQuery.value,
      page: 1,
      modalImage: "",
    });

    if (this.state.searchQuery === "") {
      await toast.error("Введите имя");
      return;
    }

    event.target.reset();
  };

  handleSelect = (event) => {
    this.setState({ perPage: event.value });
  };

  // метод добавления page в state из предыдущего стейта +1
  handleLoadMoreButton = async () => {
    try {
      await this.setState((prevState) => {
        return { page: prevState.page + 1 };
      });
    } catch (error) {}
  };
  //метод открытия закрытия модального окна
  toggleModal = () => {
    this.setState((state) => ({ isModalOpen: !state.isModalOpen }));
  };
  // setModalImage = (linkImg) => {
  //   return this.setState((state) => ({ modalImage: linkImg }));
  // };

  openLargeImage = (event) => {
    if (event.target.nodeName !== "IMG") {
      return;
    }
    this.setState({ modalImage: event.target.dataset.source });
    // this.props.modalFn(event.target.getAttribute("data"));
    // this.props.modalFn(event.target.dataset.source);
    // console.log(event.target.nodeName);
    // console.log(event.target.attributes);
    // this.setModalImage(linkImg);
    this.toggleModal();
  };
  render() {
    return (
      <>
        <ToastContainer autoClose={2000} />
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
            onChangeSelect={this.handleSelect}
          />
          <ImageGallery
            searchQuery={this.state.searchQuery}
            searchImageArray={this.state.searchImageArray}
            error={this.state.error}
            status={this.state.status}
            totalHits={this.state.totalHits}
            showLoader={this.state.showLoader}
            onClick={this.handleLoadMoreButton}
            imagesArray={this.state.images}
            modalFn={this.openLargeImage}
          />
          {/* открываем модальное окно с большим изображением если state isModalOpen=true  */}
          {this.state.isModalOpen && (
            <Modal onClose={this.toggleModal} onloader={this.loaderToggle}>
              <img src={this.state.modalImage} alt={"modal"} />
            </Modal>
          )}
        </Suspense>
      </>
    );
  }
}
