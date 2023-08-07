import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import { FlexRowBetween, MiniCardContainer, SectionContainer } from '../ui-components/atoms/container'
import { SectionHeading, Sub } from '../ui-components/atoms/text'
import { Option, Select } from '../ui-components/atoms/input'
import DataGrid from '../ui-components/molecules/Datagrid'
import axios from 'axios';
import { useSelector } from 'react-redux';

const url = '/api/getProductionDataofLastDate';
const getReq = async(url, args) => {
  const value = await axios.get(url, {
    params: args
  })

  return value.data;
}

const DeptSummary = () => {
  const [productionData, setProductionData] = useState(null);
  const [previousProductionData, setPreviousProductionData] = useState(null);
  const recent = useSelector((state) => state.dates.recent);
  const previous = useSelector((state) => state.dates.previous);

  // Get comparison % of production of recent date and production of the previous day of recent date
  const getComparison = (currentData, previousData) => {
    if(!currentData || !previousData)
      return "";

    const dif = currentData - previousData;
    const per = ((dif/currentData)*100).toFixed(2);

    return per;
  }

  // Check Increment or Decrement of production of recent date compared to production of the previous day of recent date
  const getInc = (currentData, previousData) => {
    if(!currentData || !previousData)
      return false;

    if(currentData<previousData)
      return false
    else
      return true
  }

  // If recent date is updated then production data will be updated accordingly
  useEffect(() => {
    if(recent)
    {
      const result = getReq(url, {date: new Date(recent)});
      result.then((value) => setProductionData(value));
    }
    
  }, [recent, previous])

  // If previous date is updated then production data of previous date will be updated accordingly
  useEffect(() => {
    if(previous)
    {
      const res = getReq(url, {date: new Date(previous)});
      res.then((value) => {
        setPreviousProductionData(value);
      });
    }
    
  }, [previous, recent])


  // Columns to display in Table. 
  // Header is the display name of the column and accessor is the field name of json object of production array
  const columns = React.useMemo(
    () => [
      {
        Header: 'Department',
        accessor: 'dept'
      },
      {
        Header: 'Production',
        accessor: 'production'
      },
      {
        Header: 'Comparison',
        accessor: 'comparison'
      },
      {
        Header: 'Achievement',
        accessor: 'achievement'
      },
      {
        Header: 'Efficiency',
        accessor: 'efficiency'
      }
    ],
    []
  )


  // Actual rows to diplay in table. 
  // Derived from productionData. 
  // Data is wrapped with UI component when needed using conditional rendering.
  const data = React.useMemo(
    () => [
      {dept: "Cutting", production: productionData?.Cutting?.production, comparison:<MiniCardContainer inc={getInc(productionData?.Cutting?.production, previousProductionData?.Cutting?.production)}>{getInc(productionData?.Cutting?.production, previousProductionData?.Cutting?.production)?"+":""}{getComparison(productionData?.Cutting?.production, previousProductionData?.Cutting?.production)}%</MiniCardContainer>, achievement:<MiniCardContainer inc>{productionData?.Cutting?.achievement}%</MiniCardContainer>, efficiency: <div style={{color:"#0C9C00", fontWeight:"bold"}}>{productionData?.Cutting?.efficiency}%</div>},
      {dept: "Embroidery", production: productionData?.Embroidery?.production, comparison:<MiniCardContainer inc={getInc(productionData?.Embroidery?.production, previousProductionData?.Embroidery?.production)}>{getInc(productionData?.Embroidery?.production, previousProductionData?.Embroidery?.production)?"+":""}{getComparison(productionData?.Embroidery?.production, previousProductionData?.Embroidery?.production)}%</MiniCardContainer>, achievement:<MiniCardContainer inc>{productionData?.Embroidery?.achievement}%</MiniCardContainer>, efficiency: <div style={{color:"#0C9C00", fontWeight:"bold"}}>{productionData?.Embroidery?.efficiency}%</div>},
      {dept: "Printing", production: productionData?.Printing?.production, comparison:<MiniCardContainer inc={getInc(productionData?.Printing?.production, previousProductionData?.Printing?.production)}>{getInc(productionData?.Printing?.production, previousProductionData?.Printing?.production)?"+":""}{getComparison(productionData?.Printing?.production, previousProductionData?.Printing?.production)}%</MiniCardContainer>, achievement:<MiniCardContainer inc>{productionData?.Printing?.achievement}%</MiniCardContainer>, efficiency: <div style={{color:"#0C9C00", fontWeight:"bold"}}>{productionData?.Printing?.efficiency}%</div>},
      {dept: "Finishing", production: productionData?.Finishing?.production, comparison:<MiniCardContainer inc={getInc(productionData?.Finishing?.production, previousProductionData?.Finishing?.production)}>{getInc(productionData?.Finishing?.production, previousProductionData?.Finishing?.production)?"+":""}{getComparison(productionData?.Finishing?.production, previousProductionData?.Finishing?.production)}%</MiniCardContainer>, achievement:<MiniCardContainer inc>{productionData?.Finishing?.achievement}%</MiniCardContainer>, efficiency: <div style={{color:"#0C9C00", fontWeight:"bold"}}>{productionData?.Finishing?.efficiency}%</div>}
    ],
    [productionData]
  )
  
  
  return (
    <SectionContainer>

      {/* Header */}
      <FlexRowBetween>
        <SectionHeading>
          Dept Summary
        </SectionHeading>
        <Sub>{`${new Date(recent).toLocaleDateString("en-US",{
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`}</Sub>
      </FlexRowBetween>

      {/* Data Table */}
      <DataGrid
        columns={columns}
        data={data}
        pageSize={4}
      />
    </SectionContainer>
  )
}

export default DeptSummary