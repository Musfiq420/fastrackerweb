import React, { useEffect, useState } from 'react'
import { FlexRowBetween, MiniCardContainer, SectionContainer } from '../ui-components/atoms/container'
import { SectionHeading } from '../ui-components/atoms/text'
import DataGrid from '../ui-components/molecules/Datagrid'
import Toggle from '../ui-components/molecules/Toggle'
import axios from 'axios'
import MiniBarChartUI from '../ui-components/molecules/MiniBarChart'

// Date format from Date object to mm-dd-yy formatted string
function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  return `${month}-${day}-${year}`;
}

// Process Raw Data from firebase into a formatted object Array
function processArray(arr) {
  const isArray = Array.isArray(arr)
  const output = [];
  let arra = []
  if(!arr)
    return output;

  if(!isArray)
  {
    let i = 0;
    for(i=1; i<=114; i++)
    {
      if(arr[i])
      {
        arra.push(arr[i]); 
         
      } 
      else
      {
        arra.push({
        target: 0,
        production: 0,
        issue: ""
        }); 
      }
      
    }
    arra.unshift(null);
    console.log(arra);
  }
  else {
    arra = arr
  }

  

  arra.forEach((item, index) => {

    if(item)
    {
      const keys = Object.keys(item);
      const values = Object.values(item);
  
      let sum = 0;
      const hourly = [];
  
      values.forEach((value) => {
        sum += value?.production;
        hourly.push({ hour: keys.find((key) => item[key] === value), production: value?.production, target: values?values[0]?.target:0, issue: value?.issue });
      });
  
      const avg = sum / values.length;
      const achievement = avg / values[0]?.target;
  
      output.push({
        line: index,
        target: values[0]?.target,
        avg: Number(avg.toFixed(2)),
        production: sum,
        achievement: values[0]?.target===0?"NA":(achievement*100).toFixed(2),
        hourly: hourly,
      });
    }
    else if(index===0)
    {

    }
    else {
      output.push({
        line: index,
        target: 0,
        avg: 0,
        production: 0,
        achievement: "NA",
        hourly: [],
      });
    }

    
  });

  return output;
}



const HourlyProduction = () => {
  const [selectedOption, setSelectedOption] = useState('Worst Lines');
  const [hourlyWorst, setHourlyWorst] = useState([]);
  const [hourlyBest, setHourlyBest] = useState([]);

  const onSetSelectedOption = (value) => {
    setSelectedOption(value);
  }

  // Get Realtime Production data from firebase realtime api
  // Result will be passed as an argument of processArray function
  // Then the result will be filtered and rows that doesn't have achievement are deleted
  // The the result will be sorted and sliced as worst lines and best lines
  const getRealtimeProduction = async() => {
    const res = await axios.get(`https://firsttrial-cff1d-default-rtdb.firebaseio.com/hourlyProductionData_v_200/${formatDate(new Date())}.json`);

    const processedData = processArray(res.data);
    console.log("hrly prod");
    console.log(res.data);
    const filteredArray = processedData.filter(d => 
      d.achievement !== "NA"
    );
    const filteredWorstArray = filteredArray;
    const filteredBestArray = filteredArray;

    filteredWorstArray.sort((a, b) => parseFloat(a.achievement) - parseFloat(b.achievement));
    const slicedWorstArray = filteredWorstArray.slice(0, 4);
    setHourlyWorst(slicedWorstArray);

    filteredBestArray.sort((a, b) => parseFloat(b.achievement) - parseFloat(a.achievement));
    const slicedBestArray = filteredBestArray.slice(0, 4);
    setHourlyBest(slicedBestArray);
  }

  useEffect(() => {
    getRealtimeProduction();
  }, [])

  const columns = React.useMemo(
    () => [
      {
        Header: 'Line No',
        accessor: 'line'
      },
      {
        Header: 'Target',
        accessor: 'target'
      },
      {
        Header: 'Avg Prod',
        accessor: 'avg'
      },
      {
        Header: 'Achievement',
        accessor: 'achievement'
      },
      {
        Header: 'Hourly Comparison',
        accessor: 'hourly'
      }
    ],
    []
  )

  // Convert data into visible component
  // Actual rows to diplay in table. 
  // Derived from hourlyWorst and hourlyBest based on selected option. 
  // Data is wrapped with UI component when needed using conditional rendering.
  const data = React.useMemo(
    () => selectedOption==="Worst Lines"? hourlyWorst.map((value) => ({
      line: value.line,
      target: value.target,
      avg: value.avg,
      achievement: <MiniCardContainer dec>{value.achievement}%</MiniCardContainer>,
      hourly: <MiniBarChartUI data={value.hourly} dataKey="production" targetKey="target" />
    }))
    :
    hourlyBest.map((value) => ({
      line: value.line,
      target: value.target,
      avg: value.avg,
      achievement: <MiniCardContainer inc>{value.achievement}%</MiniCardContainer>,
      hourly: <MiniBarChartUI data={value.hourly} dataKey="production" targetKey="target" />
    }))
    ,
    [hourlyWorst, hourlyBest, selectedOption]
  )

  return (
    <SectionContainer>
      <FlexRowBetween>
        <SectionHeading>
          Real Time Production Summary
        </SectionHeading>
        
        {/* filter */}
        <Toggle
          options={["Worst Lines", "Best Lines"]}
          selectedOption={selectedOption}
          setSelectedOption={(e) => onSetSelectedOption(e)}
        />
      </FlexRowBetween>

      {/* Data Table */}
      <DataGrid
        columns={columns}
        data={data}
        pageSize={4}
        // pad={true}
        />
    </SectionContainer>
  )
}

export default HourlyProduction