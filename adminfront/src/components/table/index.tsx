import React from 'react';
import "@/styles/table.css";
import TableRow from "@/components/table/tableRow";

interface TableProps {
    // columns: string[];
    // data: { [key: string]: any }[];
}

const Table: React.FC<TableProps> = ({ }) => {
    return (
        <div className='table'>
            {/* <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column}>{column}</th>
                    ))}
                </tr>
            </thead> */}
                <TableRow />
                <TableRow />
                {/* {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((column) => (
                            <td key={column}>{row[column]}</td>
                        ))}
                    </tr>
                ))} */}
        </div>
    );
};

export default Table;