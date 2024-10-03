import React from 'react';
import '@/styles/table.css';

interface TableRowProps {
    // data: { [key: string]: any };
}

const TableRow: React.FC<TableRowProps> = ({  }) => {
    return (
        <div className='table-row'>
            cocacola
            {/* {Object.values(data).map((value, index) => (
                <td key={index}>{value}</td>
            ))} */}
        </div>
    );
};

export default TableRow;