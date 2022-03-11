import React, { Component } from "react";
import { ImageGalleryList } from "./ImageGallery.styled";
import PropTypes from "prop-types";
import ImageGalleryItem from "../ImageGalleryItem";
import PixabayAPI from "../../services/PixabayAPI";
import FetchErrorView from "../FetchErrorView";

export default class ImageGallery extends Component {
  state = {
    pictures: null,
    error: null,
    status: "idle",
  };

  async componentDidUpdate(prevProps, prevState) {
    const PrevName = prevProps.foundImgs;
    const NextName = this.props.foundImgs;
    if (PrevName !== NextName) {
      try {
        console.log("изменилось имя");
        //   console.log("prevProps.searchName:", prevProps.foundImgs);
        //   console.log("this.props.searchName:", this.props.foundImgs);
        this.setState({ status: "pending" });
        await PixabayAPI(NextName).then((pictures) =>
          this.setState({ pictures, status: "resolved" })
        );
        if (this.state.pictures.total === 0) {
          return await Promise.reject(
            new Error(`There are no images with this: ${NextName}`)
          );
        }
      } catch (error) {
        this.setState({ error, status: "rejected" });
      }
    }
  }

  render() {
    const { pictures, error, status } = this.state;

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
        <ImageGalleryList>
          <ImageGalleryItem pictures={pictures} />
        </ImageGalleryList>
      );
    }
  }
}

ImageGallery.propTypes = {
  foundImgs: PropTypes.string.isRequired,
};
