import React, { Component } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { IconContext } from "react-icons";
import { ImSearch } from "react-icons/im";
import {
  SearchbarHeader,
  SearchForm,
  SearchFormButton,
  SearchFormButtonLabel,
  SearchFormInput,
} from "./Searchbar.styled";
import SelectMarks from "../SelectMarks/";

export default class Searchbar extends Component {
  state = {
    foundImgs: "",
    selectedOption: null,
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
    //проверка если мы не выбрали и она не записана в state опцию то выскочит уведомление
    if (!this.state.selectedOption) {
      toast.error(
        "Заполните поле per page, для определиния количества результатов на странице. "
      );
      return;
    }
    this.props.onSubmit(this.state.foundImgs);
    this.setState({ foundImgs: "" });
  };
  //метод для отправки props {selectedOption} в state нашего App и запись в state Searchbar
  // В дочернем элементе (компоненте) создан SelectMarks, при изменении  на нем будет
  // вызываться функция onChangeSelect, которую мы передавали с помощью props "onChange".
  // Ей передается новый параметр из допустимых опций selectedOption, именно его мы
  // хотим передать в родителя.
  onChangeSelect = (selectedOption) => {
    this.setState({ selectedOption });
    this.props.onChange(selectedOption); //onChange из Select
  };

  render() {
    return (
      <SearchbarHeader>
        <SearchForm onSubmit={this.handleSubmit}>
          <SearchFormInput
            type="text"
            name="foundImgs"
            //параметр value после ввода очищаеться вместе со state методом handleSubmit
            value={this.state.foundImgs}
            autocomplete="off"
            autoFocus={true}
            placeholder="Search images and photos"
            onChange={this.handleNameChange}
          />
          <SearchFormButton type="submit">
            <SearchFormButtonLabel>Search</SearchFormButtonLabel>
            <IconContext.Provider value={{ color: "blue", size: 30 }}>
              <ImSearch />
            </IconContext.Provider>
          </SearchFormButton>
        </SearchForm>
        {/* // Callback функция onChangeSelect  передаваемая в props onChange */}
        <SelectMarks onChange={this.onChangeSelect} />
      </SearchbarHeader>
    );
  }
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func,
};
