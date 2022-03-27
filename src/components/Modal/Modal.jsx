import React, { Component } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { OverlayModal, ModalBox } from "./Modal.styled";
// import ReactDOM from "react-dom";
// const modalRoot = document.getElementById("#modal-root");
const modalRoot = document.querySelector("#modal-root");

class Modal extends Component {
  //   constructor(props) {
  //     super(props);
  //   }
  //   state = {};
  //   modalRoot = document.createElement("div");
  componentDidMount() {
    // document.body.appendChild(this.modalRoot);
    window.addEventListener("keydown", this.closeOnKeydown);
  }
  componentWillUnmount() {
    // document.body.removeChild(this.modalRoot);
    window.removeEventListener("keydown", this.closeOnKeydown);
  }
  //   render() {
  //     return ReactDOM.createPortal(this.props.children, this.modalRoot);
  //   }
  closeOnKeydown = (event) => {
    if (event.code === "Escape") {
      this.props.onClose();
    }
  };
  closeOnBackdrop = (event) => {
    if (event.target === event.currentTarget) {
      this.props.onClose();
    }
  };
  handleKeyDown = (e) => {
    if (e.code === "ArrowLeft") {
      this.props.onLeft();
    } else if (e.code === "ArrowRight") {
      this.props.onRight();
    }
  };
  render() {
    return createPortal(
      <OverlayModal onClick={this.closeOnBackdrop}>
        <ModalBox>
          {/* <button onClick={this.props.onClose}>CLOSE</button> */}
          {this.props.children}
          {/* <img src="" alt="" /> */}
          {/* <img src={this.props.src} alt={this.props.tags} /> */}
        </ModalBox>
      </OverlayModal>,
      modalRoot
    );
  }
}

export default Modal;

Modal.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
  src: PropTypes.string,
  tags: PropTypes.string,
};
