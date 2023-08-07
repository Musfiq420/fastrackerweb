import React, { useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

const Container = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  z-index: 999;
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
`;

const DropdownItem = styled.li`
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: #f2f2f2;
  }
`;

const Dropdown = ({ options, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = options.filter((option) =>
      option.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleSelectOption = (option) => {
    setSearchTerm('');
    setFilteredOptions(options);
    onSelect(option);
  };

  const handleInputFocus = () => {
    setIsDropdownVisible(true);
  };

  const handleInputBlur = () => {
    setIsDropdownVisible(false);
  };

  return (
    <Container>
      <Input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
      <DropdownList isVisible={isDropdownVisible}>
        {filteredOptions.map((option) => (
          <DropdownItem
            key={option}
            onClick={() => handleSelectOption(option)}
          >
            {option}
          </DropdownItem>
        ))}
      </DropdownList>
    </Container>
  );
};

export default Dropdown;
