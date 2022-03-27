import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ImageGalleryItemBox,
  ImageGalleryItemImage,
} from "./ImageGalleryItem.styled";
import Modal from "../Modal";

class ImageGalleryItem extends Component {
  state = {
    isModalOpen: false,
  };
  //метод открытия закрытия модального окна
  toggleModal = () => {
    this.setState((state) => ({ isModalOpen: !state.isModalOpen }));
  };
  render() {
    const { webformatURL, tags, largeImageURL } = this.props;
    const { isModalOpen } = this.state;
    return (
      <ImageGalleryItemBox>
        <ImageGalleryItemImage
          src={webformatURL}
          alt={tags}
          onClick={this.toggleModal}
        />
        {/* открываем модальное окно с большим изображением если state isModalOpen=true  */}
        {isModalOpen && (
          <Modal onClose={this.toggleModal}>
            <img src={largeImageURL} alt={tags} />
          </Modal>
        )}
      </ImageGalleryItemBox>
    );
  }
}
ImageGalleryItem.propTypes = {
  toggleModal: PropTypes.func,
};

export default ImageGalleryItem;
