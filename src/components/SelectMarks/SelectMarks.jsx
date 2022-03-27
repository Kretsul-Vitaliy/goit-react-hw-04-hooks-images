import React from "react";
import Select from "react-select";
import { SelectBox } from "./SelectMarks.styled";

const perPage = [
  { value: 6, label: "6" },
  { value: 12, label: "12" },
  { value: 20, label: "20" },
  { value: 30, label: "30" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
  { value: 150, label: "150" },
  { value: 200, label: "200" },
];

class SliderMarks extends React.Component {
  state = {
    // selectedOption: { value: 12, label: "12" },
  };
  //метод для выбора опций из списка
  // В дочернем элементе (компоненте SelectMarks) создан Select из библиотеки "react-select", при изменении  на нем будет
  // вызываться функция handleChangePerPage, которую мы передавали с помощью функцией для форм "onChange".
  // Ей передается новый параметр из допустимых опций в переменной perPage, значения value в props selectedOption, именно его мы
  // хотим передать в родителя Searchbar
  handleChangePerPage = (selectedOption) => {
    this.props.onChange({ selectedOption }); // мы вызываем функцию this.props.onChange(), которая будет предоставлена компонентом Searchbar и передаваемая в props SelectMarks
  };
  render() {
    return (
      <SelectBox>
        per page
        <Select
          options={perPage}
          // defaultValue={perPage[1]}
          value={this.props.selectedOption} // этот пропс мы передаем selectedOption в функциею handleChangePerPage
          onChange={this.handleChangePerPage} // Callback функция handleChangePerPage  передаваемая функцией для форм onChange
          isClearable
          isLoading
          theme={(theme, provided, state) => ({
            ...theme,
            borderRadius: 5,
            backgroundColor: "#3f51b5",
            colors: {
              ...theme.colors,
              primary25: "pink",
              primary75: "black",
            },
          })}
        />
      </SelectBox>
    );
  }
}

export default SliderMarks;
