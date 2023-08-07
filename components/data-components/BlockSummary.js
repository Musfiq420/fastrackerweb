import React, { useEffect, useState } from 'react'
import Table from '../ui-components/molecules/Table'
import { ComparisonContainer, FlexRowBetween, MiniCardContainer, SectionContainer } from '../ui-components/atoms/container'
import { SectionHeading, Sub } from '../ui-components/atoms/text'
import { Option, Select } from '../ui-components/atoms/input'
import DataGrid from '../ui-components/molecules/Datagrid'
import axios from 'axios'
import { useSelector } from 'react-redux'


// Iterate over all line data and convert into block wise aggregation
function calculateAggregates(array) {
  const aggregates = {};

  // Define the ranges of line numbers as block
  const ranges = [
    { start: 1, end: 6 },
    { start: 7, end: 15 },
    { start: 16, end: 21 },
    { start: 22, end: 30 },
    { start: 31, end: 36 },
    { start: 37, end: 45 },
    { start: 46, end: 55 },
    { start: 56, end: 62 },
    { start: 63, end: 69 },
    { start: 70, end: 76 },
    { start: 77, end: 81 },
    { start: 82, end: 86 },
    { start: 87, end: 91 },
    { start: 92, end: 96 },
    { start: 97, end: 105 },
    { start: 106, end: 114 }
  ];

  // Iterate over the ranges
  for (const range of ranges) {
    const { start, end } = range;

    // Calculate the aggregate values
    let samEarnersSum = 0;
    let outputSum = 0;
    let earnMinSum = 0;
    let availableMinSum = 0;

    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      const lineNumber = item.line;

      if (lineNumber >= start && lineNumber <= end) {
        
        samEarnersSum += Number(item['sam earners']);
        outputSum += Number(item.output);
        earnMinSum += Number(item['earn min']);
        availableMinSum += Number(item['available min']);
      }
    }

    // Calculate efficiency as a percentage
    const efficiency = ((earnMinSum / availableMinSum) * 100).toFixed(2) + '%';

    // Create the aggregate object
    const key = `${start}-${end}`;
    aggregates[key] = {
      'block' : `${start}-${end}`,
      'sam earners': samEarnersSum,
      output: outputSum,
      efficiency: efficiency
    };
  }

  return aggregates;
}

const BlockSummary = () => {
  const [data, setData] = useState(null);
  const recent = useSelector((state) => state.dates.recent);

  // API call to get the array of line wise production data.
  // The result will be passed as an argument of calculateAggreates function. 
  // The returned object's value will be stored as modifiedBlockArray
  
  const getAllLineEfficiencyByDate = async() => {
    console.log(recent)
    const res =  await axios.get('/api/getAllLineEfficiencyByDate', {
        params: {
            date: new Date(recent)
        }
    });
    
    console.log(res.data);
    
    const agr = calculateAggregates(res.data);

    const modifiedBlockArray = Object.values(agr);
    
    setData(modifiedBlockArray);
  }

  // If recent date is updated then function to get data is called to get the updated data
  useEffect(() => {
    if(recent)
    {
      getAllLineEfficiencyByDate();
    }
        
  }, [recent])

   // Columns to display in Table. 
  // Header is the display name of the column and accessor is the field name of json object of data array
  const columns = React.useMemo(
    () => [
      {
        Header: 'Block',
        accessor: 'block'
      },
      {
        Header: 'Production',
        accessor: 'output'
      },
      {
        Header: 'Efficiency',
        accessor: 'efficiency'
      }
    ],
    []
  )
  
  return (
    <SectionContainer>

      {/* Header */}
      <FlexRowBetween>
        <SectionHeading>
          Block Summary
        </SectionHeading>
        <Sub>{`${(new Date(recent)).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`}</Sub>
      </FlexRowBetween>

      {/* Data Table */}
      {data?<DataGrid
        columns={columns}
        data={data}
        pageSize={4}
        />:<></>}
      
    </SectionContainer>
  )
}

export default BlockSummary