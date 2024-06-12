import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';

const Pagination = ({ data, columns }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const displayedData = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map((column, index)=>(
                <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedData.map((row,rowIndex) => (
            <tr key={rowIndex}>
                {row.map((element,cellIndex)=>(
                    <td key={cellIndex}>{element}</td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        pageCount={Math.ceil(data.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </div>
  );
};

export default Pagination;
