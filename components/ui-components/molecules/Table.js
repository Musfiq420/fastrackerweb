import React, { useEffect } from 'react'
import { usePagination, useTable } from 'react-table';
import { Button } from '../atoms/input';
import { CSVLink } from 'react-csv';

const Table = ({columns, data, pageSize, filename}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        page,
        state: { pageIndex },
        setPageSize,
        previousPage,
        getCanPreviousPage,
        nextPage,
        getCanNextPage,
        setPageIndex,
        getState,
        pageCount
      } = useTable({ columns, data, initialState: { pageIndex: 0} }, usePagination);
    
      useEffect(() => {
        setPageSize(pageSize);
      }, []) 

    //   useEffect(() => {
    //     console.log(pageIndex)
    //   }, [pageIndex]) 

  return (
    <div style={{display:'flex', flexDirection:'column', padding:'1%', width:"100%"}} >
        <div style={{overflowX:"scroll"}} >
        <table style={{width:'100%'}} {...getTableProps()}>
                <thead>
                    {
headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {
                            headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </th>
                            ))
                        }
                        
                    </tr>
                ))
            }
            </thead>
                
            
            <tbody  {...getTableBodyProps()}>
                {
                    page.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {
                                    row.cells.map((cell) => (
                                        <td {...cell.getCellProps()}  >
                                            <div style={{fontSize:'12px'}}>
                                                {cell.value}
                                            </div>
                                            {/* <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                                                {cell.value.toString().split(',').map((e) => (
                                                <div style={{fontSize:14, border:"0px solid #B9F6CA", borderRadius:"5px", padding:"5px", margin:"5px", backgroundColor:"#00C853", color:"white"}}>
                                                    {e}
                                                </div>
                                                
                                                ))}
                                            </div> */}
                                                    {/* <div>{
                                                    cell.render('Cell').toString().split(",").map(e => {
                                                        console.log(e.value);
                                                    return (<h3>{e}</h3>)
                                                })
                                                    
                                                    }</div> */}
                                                    
                                            
                                        </td>
                                    ))
                                }
                                
                            </tr>
                        )
                    })
                }
            
            </tbody> 
            
        </table>
        </div>
        
        <div style={{marginTop:'10px', paddingLeft:'20px', display:'flex', alignItems:'center', justifyContent:'space-between'}} >
            
            <div>Page <strong>
                {pageIndex + 1} of{' '}
                {pageCount}
            </strong></div>
            
            <div>
                <Button
                  disabled={pageIndex===0}
                  onClick={() => previousPage()}
                >{'<'}</Button>
                <Button
                  disabled={(pageIndex+1) >= pageCount}
                  onClick={() => nextPage()}
                >{'>'}</Button>
            </div>
            
        </div>
        <div style={{display:'flex', justifyContent:'end', paddingTop: "20px"}}>
        <CSVLink filename={filename} data={data}><span style={{color:'Highlight', textDecoration:"underline"}}>Download as CSV</span></CSVLink>

        </div>

    </div>
  )
}

export default Table