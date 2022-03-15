import React, { Component } from "react";
import { ImageGalleryList } from "./ImageGallery.styled";
import PropTypes from "prop-types";
import ImageGalleryItem from "../ImageGalleryItem";
import FetchPixabayAPISearch from "../../services/PixabayAPI";
import FetchErrorView from "../FetchErrorView";
import Button from "../Button/";

export default class ImageGallery extends Component {
  state = {
    SearchNameImgs: null,
    error: null,
    status: "idle",
    page: 1,
    imagesFound: null,
  };

  async componentDidUpdate(prevProps, prevState) {
    const PrevName = prevProps.foundImgs;
    const NextName = this.props.foundImgs;
    const PrevPage = prevState.page;
    const NextPage = this.state.page;

    if (PrevName !== NextName) {
      try {
        this.setState({ status: "pending", SearchNameImgs: [] });
        this.setState({ page: 1 });
        const picturesArray = await FetchPixabayAPISearch(NextName, NextPage);
        this.setState({
          SearchNameImgs: picturesArray.hits,
          status: "resolved",
          imagesFound: picturesArray.total,
        });
        console.log("Всего найдего изображений: ", picturesArray.total);
        if (picturesArray.total === 0) {
          return await Promise.reject(
            new Error(`There are no images with this: ${NextName}`)
          );
        }
      } catch (error) {
        this.setState({ error, status: "rejected" });
      }
    }
    if (PrevPage !== NextPage) {
      try {
        const picturesArray = await FetchPixabayAPISearch(NextName, NextPage);
        this.setState({ status: "pending" });
        if (picturesArray.total === 0) {
          return await Promise.reject(new Error("Try another name"));
        }
        if (NextPage !== 1) {
          this.setState((prevState) => {
            return {
              SearchNameImgs: [
                ...prevState.SearchNameImgs,
                ...picturesArray.hits,
              ],
              status: "resolved",
            };
          });
          window.scrollBy({
            top: 300,
            behavior: "smooth",
          });
        }
      } catch (error) {
        this.setState({ status: "rejected", error: error.message });
      }

      console.log("Всего просмотрено: ", this.state.SearchNameImgs.length);
    }
  }

  onLoadMore = () => {
    if (this.state.imagesFound > this.state.SearchNameImgs.length) {
      this.setState((prevState) => {
        return { page: prevState.page + 1 };
      });
    }
  };

  render() {
    const { SearchNameImgs, error, status } = this.state;

    if (status === "idle") {
      return <div>Введите имя</div>;
    }
    if (status === "pending") {
      return <div>Загружаем...</div>;
    }

    if (status === "rejected") {
      return <FetchErrorView message={error.message} />;
    }
    if (status === "resolved") {
      return (
        <>
          <ImageGalleryList>
            <ImageGalleryItem SearchNameImgs={SearchNameImgs} />
            <Button
              type="button"
              active={true}
              disabled={false}
              onClick={this.onLoadMore}
            >
              Load More
            </Button>
          </ImageGalleryList>
        </>
      );
    }
  }
}

ImageGallery.propTypes = {
  foundImgs: PropTypes.string.isRequired,
};
