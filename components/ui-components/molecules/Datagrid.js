import React, { useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

const TableContainer = styled.div`
  overflow-x: auto;
  height: ${(props) => (props.height)}vh;
`;

const Table = styled.table`
  margin-top: 20px;
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`

  padding: 0.3rem;
  text-align: start;
  border-bottom: 2px solid lightgray;
  color: ${props => props.theme.colors.primary};
`;

const TableCell = styled.td`
  padding: 5px;
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

const DataGrid = ({ data, columns, pageSize, height, pad }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }

    console.log("page: ")
    console.log(currentData);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
    console.log("page: ")
    console.log(currentData);
  };

  return (
    <>
      <TableContainer height={height}>
        <Table>
          <thead>
            <tr>
              {columns.map((column) => (
                <TableHeader key={column.accessor}>{column.Header}</TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, i) => (
              <tr key={item.id+item.date+item.process+i}>
                {columns.map((column) => (
                  <TableCell key={column.accessor+item.id}>{item[column.accessor]}</TableCell>
                ))}
              </tr>
            ))}
          </tbody>
          {pad?<div style={{padding:"30px"}} />:null}
        </Table>
      </TableContainer>
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
    </>
  );
};

export default DataGrid;