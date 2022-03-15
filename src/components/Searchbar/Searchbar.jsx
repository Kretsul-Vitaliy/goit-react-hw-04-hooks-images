import React, { Component } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import {
  SearchbarHeader,
  SearchForm,
  SearchFormButton,
  SearchFormButtonLabel,
  SearchFormInput,
} from "./Searchbar.styled";
import { ImSearch } from "react-icons/im";

export default class Searchbar extends Component {
  state = {
    foundImgs: "",
  };

  //метод для записи в state то что набираем в input
  handleNameChange = (event) => {
    this.setState({ foundImgs: event.currentTarget.value.toLowerCase() });
  };

  //метод для отправки props в state нашего App
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.foundImgs.trim() === "") {
      toast.error("Введите имя");
      return;
    }
    this.props.onSubmit(this.state.foundImgs);
    this.setState({ foundImgs: "" });
  };

  render() {
    return (
      <SearchbarHeader>
        <SearchForm onSubmit={this.handleSubmit}>
          <SearchFormButton type="submit">
            <ImSearch />
            <SearchFormButtonLabel>Search</SearchFormButtonLabel>
          </SearchFormButton>

          <SearchFormInput
            type="text"
            name="foundImgs"
            //параметр value после ввода очищаеться вместе со state методом handleSubmit
            value={this.state.foundImgs}
            autocomplete="off"
            placeholder="Search images and photos"
            onChange={this.handleNameChange}
          />
        </SearchForm>
      </SearchbarHeader>
    );
  }
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func,
};
