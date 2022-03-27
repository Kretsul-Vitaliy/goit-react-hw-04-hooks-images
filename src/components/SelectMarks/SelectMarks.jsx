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
  // В дочернем элементе (компоненте) создан Select, при изменении  на нем будет
  // вызываться функция handleChangePerPage, которую мы передавали с помощью props "onChange".
  // Ей передается новый параметр из допустимых опций selectedOption, именно его мы
  // хотим передать в родителя.
  handleChangePerPage = (selectedOption) => {
    this.props.onChange({ selectedOption });
  };
  render() {
    return (
      <SelectBox>
        per page
        <Select
          options={perPage}
          // defaultValue={perPage[1]}
          value={this.props.selectedOption}
          onChange={this.handleChangePerPage} // Callback функция handleChangePerPage  передаваемая в props onChange
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
