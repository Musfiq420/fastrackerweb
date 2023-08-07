import { useState } from 'react';
import styled from '@emotion/styled';

const ToggleContainer = styled.div`
  display: flex;
`;

const ToggleOption = styled.div`
  font-size: small;
    height: min-content;
    padding: 2px;
    border-radius: 5px;
    color: ${({ selected}) => (selected ? props => props.theme.colors.primary : "gray")};
    border: 1px solid ${props => props.theme.colors.title};
    font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};;
  background-color: ${({ selected }) => (selected ? '#D8F5D6' : 'none')};
  border-radius: ${({ isFirst, isLast }) =>
    isFirst ? '4px 0 0 4px' : isLast ? '0 4px 4px 0' : 'none'};
  cursor: pointer;

  &:not(:last-child) {
    margin-right: 0;
  }
`;

const Toggle = ({ options, selectedOption, setSelectedOption }) => {

  const handleOptionClick = (option) => {
    if (option !== selectedOption) {
      setSelectedOption(option);
    }
  };

  return (
    <ToggleContainer>
      {options.map((option, index) => (
        <ToggleOption
          key={option}
          selected={option === selectedOption}
          isFirst={index === 0}
          isLast={index === options.length - 1}
          onClick={() => handleOptionClick(option)}
        >
          {option}
        </ToggleOption>
      ))}
    </ToggleContainer>
  );
};

export default Toggle;
