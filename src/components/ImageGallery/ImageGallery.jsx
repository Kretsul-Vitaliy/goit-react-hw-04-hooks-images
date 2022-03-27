import React, { Component, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { ImageGalleryList, LoadMoreBox } from "./ImageGallery.styled";
import FetchPixabayAPI from "../../services/PixabayAPI";
import FetchErrorView from "../FetchErrorView";
import Button from "../Button/";
import Loader from "../Loader/";
// import ImageGalleryItem from "../ImageGalleryItem";
const ImageGalleryItem = lazy(() => import("../ImageGalleryItem"));

class ImageGallery extends Component {
  state = {
    page: null,
    perPage: null,
    SearchImageArray: [],
    error: null,
    status: "idle",
    totalPages: null,
    totalHits: null,
  };

  async componentDidUpdate(prevProps, prevState) {
    const PrevName = prevProps.searchQuery;
    const NextName = this.props.searchQuery;
    const PerPageProps = this.props.selectedOption.value;
    const PropsPage = this.props.page;
    const NextPage = this.state.page;
    const PrevPage = prevState.page;

    try {
      if (PrevName !== NextName) {
        await this.setState({
          SearchImageArray: [],
          page: PropsPage,
          perPage: PerPageProps,
          status: "pending",
        });
        await this.searchPictures();
        toast.success(
          await `Найдено ${this.state.totalHits} изображений ${NextName}`,
          { delay: 200 }
        );
      }
      if (NextPage !== PrevPage && NextPage !== 1) {
        await this.setState({
          perPage: PerPageProps,
          //   status: "pending",
        });
        await this.searchPictures();
        //scrollBy прокрутит в нижней точке список
        //scrollTo прокрутит в верхней точке список
        await window.scrollBy({
          //   top: document.documentElement.scrollHeight, //прокрутит весь документ в конец
          top: 1000,
          behavior: "smooth",
        });
        if (this.state.SearchImageArray.length >= this.state.totalHits) {
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
    const NextName = this.props.searchQuery;
    const NextPage = this.state.page;
    const PerPageState = this.state.perPage;
    const PicturesArray = FetchPixabayAPI(NextName, NextPage, PerPageState);
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
      //   console.log("picturesArray", picturesArray);

      //первый вариант записи
      //   this.setState((prevState) => ({
      //     SearchImageArray: [...prevState.SearchImageArray, ...picturesArray],
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
          SearchImageArray: [...prevState.SearchImageArray, ...picturesArray],
          error: null,
          // resolve.totalHits - переменная количества найденных фото для API это максимальное количество
          totalHits: resolve.totalHits,
          totalPages: Math.ceil(resolve.totalHits / PerPageState), //получаем общее количество страниц
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
  // метод добавления page в state из предыдущего стейта +1
  handleLoadMoreButton = async () => {
    try {
      await this.setState((prevState) => {
        return { page: prevState.page + 1 };
      });
    } catch (error) {}
  };

  render() {
    const { SearchImageArray, error, status, totalHits } = this.state;
    // применяем метод state mashine где:
    // "idle"- простой,
    // "pending" - ожидаеться,
    // "rejected" - отклонено,
    // "resolved" - выполнился
    if (status === "idle") {
      return (
        <div style={{ textAlign: "center", fontSize: "larger" }}>
          Введите <b>имя</b> и заполните поле <b>per page</b>, <br />
          для определиния количества результатов на странице.
        </div>
      );
    }
    if (status === "pending") {
      // return <div>Загружаем...</div>;
      return <Loader />;
    }

    if (status === "rejected") {
      return <FetchErrorView message={error} />;
    }
    if (status === "resolved") {
      return (
        <>
          <Suspense
            fallback={
              <div>
                Loading...
                <Loader />
              </div>
            }
          >
            <ImageGalleryList SearchImageArray={SearchImageArray}>
              {SearchImageArray.map(
                ({ id, webformatURL, largeImageURL, tags }) => {
                  return (
                    <ImageGalleryItem
                      key={id}
                      webformatURL={webformatURL}
                      largeImageURL={largeImageURL}
                      tags={tags}
                    />
                  );
                }
              )}
            </ImageGalleryList>
            {status === "pending" && <Loader />}
            {SearchImageArray.length < totalHits && (
              <LoadMoreBox>
                <Button
                  type="button"
                  active={true}
                  disabled={false}
                  onClick={this.handleLoadMoreButton}
                >
                  Load More
                </Button>
              </LoadMoreBox>
            )}
          </Suspense>
        </>
      );
    }
    // return <div></div>;
  }
}
ImageGallery.propTypes = {
  SearchImageArray: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      largeImageURL: PropTypes.string,
      tags: PropTypes.string,
      webformatURL: PropTypes.string,
    })
  ),
};
export default ImageGallery;
