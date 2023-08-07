import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

const Table = styled.table`
  margin-top: 20px;
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 0.3rem;
  text-align: start;
  border-bottom: 2px solid lightgray;
  color: ${(props) => props.theme.colors.primary};
`;

const TableCell = styled.td`
  padding: 0.3rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const PaginationInfo = styled.div`
  padding-left: 10px;
  font-size: 14px;
  opacity: 70%;
`;

const PaginationButtons = styled.div``;

const PaginationButton = styled.button`
  padding: 0.5rem;
  margin: 0 0.25rem;
  color: ${(props) => (props.disabled ? '#ccc' : 'gray')};
  border: none;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;

const Overlay = styled.div`
  position: absolute;
  top: ${(props) => props.position.top}px;
  right: ${(props) => props.position.right}px;
  left: ${(props) => props.position.left}px;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  z-index: 3000;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 4px;
`;

const CheckboxContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
`;

const CheckboxLabel = styled.label`
  margin-left: 5px;
`;

const DataGrid = ({ data, columns, pageSize }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('');
  
  const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0 });

  const init = () => {
    const initialFilters = {};
    columns.forEach((column) => {
      const uniqueValues = [...new Set(data.sort((a,b) => (a.line - b.line)).map((item) => item[column.accessor]))];
      const columnFilters = {};
      uniqueValues.forEach((value) => {
        columnFilters[value] = true;
      });
      initialFilters[column.accessor] = columnFilters;
    });
    return initialFilters;
  };
  const [selectedFilters, setSelectedFilters] = useState(init());
  useEffect(() => {
    setSelectedFilters(init());
  }, [data]);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  function isLastIndex(item, array) {
    // console.log(array[array.length - 1])
    return array[array.length - 1].accessor === item;
  }
  
  

  const openModal = (column, event) => {
    setSelectedColumn(column);
    setIsModalOpen(true);

    const lastIndex = isLastIndex(column, columns);

    const buttonPosition = event.target.getBoundingClientRect();

    const top = buttonPosition.bottom + window.scrollY;

    const left = lastIndex?null:buttonPosition.right +5 + window.scrollX;
    const right = lastIndex?200:null;

      setOverlayPosition({ top, right, left });
    
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFilterSelection = (value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [selectedColumn]: {
        ...(prevFilters[selectedColumn] || {}),
        [value]: !prevFilters[selectedColumn]?.[value],
      },
    }));
  };

  const toggleSelectAll = () => {
    const columnFilters = { ...selectedFilters[selectedColumn] };
    const allChecked = Object.values(columnFilters).every((value) => value);
    Object.keys(columnFilters).forEach((value) => {
      columnFilters[value] = !allChecked;
    });
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [selectedColumn]: columnFilters,
    }));
  };

  const filteredData = data.filter((item) => {
    for (const column in selectedFilters) {
      if (Object.keys(selectedFilters[column]).length === 0) {
        continue;
      }
      if (selectedFilters[column] && !selectedFilters[column][item[column]]) {
        return false;
      }
    }
    return true;
  });

  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const uniqueValuesForColumn = (column) => {
    return [...new Set(data.map((item) => item[column]))];
  };

  return (
    <>
      <Table>
        <thead>
          <tr>
            {columns.map((column) => (
              <TableHeader key={column.accessor}>
                {column.Header}
                <button onClick={(event) => openModal(column.accessor, event)}>Filter</button>
              </TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.id}>
              {columns.map((column) => (
                <TableCell key={column.accessor}>{item[column.accessor]}</TableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <PaginationContainer>
        <PaginationInfo>
          Page {currentPage} of {totalPages}
        </PaginationInfo>
        <PaginationButtons>
          <PaginationButton disabled={currentPage === 1} onClick={goToPreviousPage}>
            &lt;
          </PaginationButton>
          <PaginationButton disabled={currentPage === totalPages} onClick={goToNextPage}>
            &gt;
          </PaginationButton>
        </PaginationButtons>
      </PaginationContainer>

      {isModalOpen && (
        <Overlay position={overlayPosition}>
          <ModalContainer>
            <h3>Filter {selectedColumn}</h3>
            <CheckboxContainer>
              <CheckboxContainer>
                <input
                  type="checkbox"
                  checked={selectedFilters[selectedColumn] ? Object.values(selectedFilters[selectedColumn]).every((value) => value) : true}
                  onChange={toggleSelectAll}
                />
                <CheckboxLabel>Select All</CheckboxLabel>
              </CheckboxContainer>
              {uniqueValuesForColumn(selectedColumn).map((value) => (
                <CheckboxContainer key={value}>
                  <input
                    type="checkbox"
                    checked={selectedFilters[selectedColumn]?.[value]}
                    onChange={() => handleFilterSelection(value)}
                  />
                  <CheckboxLabel>{value}</CheckboxLabel>
                </CheckboxContainer>
              ))}
            </CheckboxContainer>
            <button onClick={closeModal}>Close</button>
          </ModalContainer>
        </Overlay>
      )}
    </>
  );
};

export default DataGrid;
