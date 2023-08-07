/** @jsxImportSource @emotion/react */
import Topbar from '@/components/layout/topbar'
import { Coln, FlexRow, InitialGap, MiniCardContainer, Page } from '@/components/ui-components/atoms/container'
import { Button, ButtonOutline, Input, Option, Select } from '@/components/ui-components/atoms/input'
import DataGrid from '@/components/ui-components/molecules/Datagrid'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { blockWiseLine } from '@/lib/blockWiseLine';
import { Container, Row } from 'react-grid-system'
import { Caption, PrimaryHeading1, PrimaryHeading3 } from '@/components/ui-components/atoms/text'
import { css } from '@emotion/react'
import { SectionContainer } from '@/components/ui-components/atoms/container'
import BarChartUI from '@/components/ui-components/molecules/BarChart'

// Date format from Date object to mm-dd-yy formatted string
function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  return `${month}-${day}-${year}`;
}

// Format in standard hour as "hh:mm a" format string to display in graph
function convertToStandardFormat(hour) {
  if (hour < 0 || hour > 23) {
    return "Invalid hour";
  }

  if (hour == 12) {
    return "12:00 pm";
  }

  if (hour < 12) {
    return hour + ":00 am";
  }


  return (hour - 12) + ":00 pm";
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
    // arra = Object.values(arr);
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
        hourly.push({ hour: convertToStandardFormat(keys.find((key) => item[key] === value)) , production: value?.production, target: values?values[0]?.target:0, issue: value?.issue });
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


const RealTime = () => {
    const [rawData, setRawData] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState(0);
    const onSetSelectedBlock = (e) => {
        setSelectedBlock(e.target.value); 
      }

      // Get Realtime Production data from firebase realtime api
      // Result will be filtered by lines of selected block
      // The the result will be stored in rawData state
      const getRealtimeProduction = async() => {
        const res = await axios.get(`https://firsttrial-cff1d-default-rtdb.firebaseio.com/hourlyProductionData_v_200/${formatDate(new Date())}.json`);
    
        console.log(res.data);
        const processedData = processArray(res.data);
        const filteredArray = processedData.filter(d => 
          d.achievement !== "NA" &&
          blockWiseLine[selectedBlock].includes(d.line)
        );
        
        setRawData(filteredArray);
      }

    // If selected selected block is updated then rawData will be updated accordingly
    useEffect(() => {
      getRealtimeProduction();
    }, [selectedBlock])

    // Columns to display in Table. 
    // Header is the display name of the column and accessor is the field name of json object of rawData array
    const columns = React.useMemo(
      () => [
        {
          Header: 'Line No',
          accessor: 'line'
        },
        {
          Header: 'Hourly Comparison',
          accessor: 'hourly'
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
          Header: 'Total Prod',
          accessor: 'production'
        },
        {
          Header: 'Achievement',
          accessor: 'achievement'
        }
        
      ],
      []
    )
  
    // Actual rows to diplay in table. 
    // Derived from rawData. 
    // Data is wrapped with UI component when needed using conditional rendering.
    const data = React.useMemo(
      () => rawData.map((value) => ({
        line: value.line,
        target: value.target,
        avg: value.avg,
        production: value.production,
        achievement: <MiniCardContainer inc>{value.achievement}%</MiniCardContainer>,
        hourly: <BarChartUI data={value.hourly} dataKey="production" targetKey="target" yDataKey="hour" />
      }))
      ,
      [rawData]
    )

  return (
    <Page>
      <Topbar title="Realtime Analysis" />
      <InitialGap /> 
      <Container style={{margin:"0px"}} fluid>
      
      {/* Block Filter */}
      <FlexRow>
      <Select value={selectedBlock} onChange={onSetSelectedBlock}>
            {
            blockWiseLine.map((e, i) => (<option value={i}>Block: {e[0]} - {e[e.length - 1]}</option>))
            }
        </Select>
      </FlexRow>
      <div css={css`height:2vh;`} />
      <SectionContainer>
        <Row>
          
        {/* Data Table */}
          <Coln sm={12} lg={12}>
            <div css={css`padding:20px;`} >
              <DataGrid
                height={55}
                  data={data}
                  columns={columns}
                  pageSize={10}
                />
            </div>
          
          </Coln>
        </Row>
        </SectionContainer>
      </Container>
    </Page>
  )
}

export default RealTime