import React from 'react';
import './Pagination.css';

const Pagination: React.FC = () => {
  return (
    <div className="pagination">
      <div className="pagination__info">
        Showing 1-09 of 78
      </div>
      <div className="pagination__controls">
        <button className="pagination__button pagination__button--prev">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8e05ca75dbcdef6767461dcd4786a4c8dd501f644acd20b667a7113034056ab1?placeholderIfAbsent=true&apiKey=482c75c84bdb4c88a7a67a7f2dd73013"
            className="pagination__button-icon"
            alt="Previous"
          />
        </button>
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            className={`pagination__button ${
              page === 1 ? 'pagination__button--active' : ''
            }`}
          >
            {page}
          </button>
        ))}
        <button className="pagination__button pagination__button--next">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a130920dc21666b7c4030c71004cfe88af7ddc60f2fcffdfe6e7eb7179cd636e?placeholderIfAbsent=true&apiKey=482c75c84bdb4c88a7a67a7f2dd73013"
            className="pagination__button-icon"
            alt="Next"
          />
        </button>
      </div>
    </div>
  );
};

export default Pagination;