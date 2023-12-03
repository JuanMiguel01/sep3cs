/* Copyright (c) 2023-2025
 * This file is part of sep3cs.
 *
 * sep3cs is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * sep3cs is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with sep3cs. If not, see <http://www.gnu.org/licenses/>.
 */
import React from 'react';
import './HomeTable.css';

function convertToTableFormat(columns, data) {
 return data.map(item => {
   let obj = {};
   columns.forEach((column, index) => {
     obj[column] = item[index];
   });
   return obj;
 });
}

const Table = ({ columns, data }) => {
 const tableData = convertToTableFormat(columns, data);

 return (
   <table>
     <caption>Top Players in Wars</caption>
     <thead>
       <tr>
         {columns.map((column, index) => (
           <th key={index}>{column}</th>
         ))}
       </tr>
     </thead>
     <tbody>
       {tableData.map((row, index) => (
         <tr key={index}>
           {columns.map((column, index) => (
             <td key={index}>{row[column]}</td>
           ))}
         </tr>
       ))}
     </tbody>
   </table>
 );
};

export default Table;
