import React, { useRef } from "react";
import ReactSelect from "react-select";
import AsyncSelect from "react-select/async";

// if you want to customize the icon on the select input or if you want to add custom styles
const customizeSearch = _ => ({
  components: {
    DropdownIndicator: _ => <i className="icn-logo material-icons">search</i>
  },
  customStyles: {
    dropdownIndicator: base => ({ ...base, transition: "all .2s ease" })
  }
});

// component for if no results are found, feel free to replace with whatever you want
const emptyOptions = ({ inputValue }) => (
  <div>{inputValue ? "No Results Found" : "Type To Search"}</div>
);

const SmartSearch = ({
  label,
  className,
  onInputChange,
  onChange,
  async,
  value,
  placeholder,
  options,
  loadOptions
}) => {
  // we make a ref so we can close the dropdown after we make a selection otherwise itll still remain open - try removing this logic to test if youd like
  const selectRef = useRef(null);

  // for when a user is typing to find an option -> this does not actually select it, they will need to click on one of the options
  const handleInputChange = input => onInputChange && onInputChange(input);

  // handler for when an option is selected
  const handleChange = value => {
    onChange && onChange(value);
    selectRef.current.blur();
  };

  // if the async prop is passed in then we will use AsyncSelect
  const Select = async ? AsyncSelect : ReactSelect;

  return (
    <>
      {label && <label>{label}</label>}
      <Select
        {...customizeSearch()}
        className={className}
        ref={selectRef}
        placeholder={placeholder}
        noOptionMessage={emptyOptions}
        isSearchable
        isClearable
        options={options}
        loadOptions={loadOptions}
        onInputChange={handleInputChange}
        onChange={handleChange}
        value={value}
      />
    </>
  );
};

export default SmartSearch;
