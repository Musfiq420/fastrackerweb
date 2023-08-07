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


// function to convert all raw efficiency data into summarized data (Total Defected, Total Lost, Most Frequent Type)
function aggregateData(input) {
    const output = {
      "total machine": 0,
      "total lost": 0,
      "most type": ""
    };
  
    const uniqueMachineIds = new Set();
    const machineCount = {};
  
    let totalLost = 0;
    let maxCount = 0;
    let mostType = "";
  
    for (const item of input) {
      uniqueMachineIds.add(item.id);
  
      const lost = parseFloat(item.lost);
      if (!isNaN(lost)) {
        totalLost += lost;
      }
  
      if (machineCount[item.id]) {
        machineCount[item.id]++;
      } else {
        machineCount[item.id] = 1;
      }
  
      if (machineCount[item.id] > maxCount) {
        maxCount = machineCount[item.id];
        mostType = item.name;
      }
    }
  
    output["total machine"] = uniqueMachineIds.size;
    output["total lost"] = totalLost.toFixed(2);
    output["most type"] = mostType;
  
    return output;
  }

const MachineBreakdown = () => {
    const todayString = (new Date()).toLocaleDateString('fr-CA');
    const today = new Date(todayString);
    const [selectedDate, setSelectedDate] = useState(today);
    const onSetDate = async(event) => {
        const d = new Date(event.target.value)
        setSelectedDate(d);
      }

    const [rawData, setRawData] = useState([]);

    // Initial object schema with field for aggData state
    const [aggData, setAggData] = useState({
        "total machine": 0,
        "total lost": 0,
        "most type": ""
      })

    // API call to get machine breakdown data in a given date.
    // date is passed as parameter of the api
    // Result array is saved in rawData state
    // Same data is also aggregated for summarized data (Total Defected, Total Lost, Most Frequent Type)
    const getMachineLostTimeByDate = async() => {
      console.log(selectedDate);
        const res =  await axios.get('/api/getMachineLostTimeByDate', {
            params: {
                date: selectedDate
            }
        });
        console.log(JSON.stringify(res.data));
        const tempAgg = aggregateData(res.data);
        setAggData(tempAgg);
        setRawData(res.data);
    }

    // If selected date is updated then machine breakdown data will be updated accordingly
    useEffect(() => {
        getMachineLostTimeByDate();
    }, [selectedDate])

  // Columns to display in Table. 
  // Header is the display name of the column and accessor is the field name of json object of rawData array
  const columns = React.useMemo(
        () => [
          {
            Header: 'Line',
            accessor: 'line', // accessor is the "key" in the data
          },
          {
            Header: 'Machine ID',
            accessor: 'id',
          },
          {
            Header: 'Machine Type',
            accessor: 'name',
          },
          {
            Header: 'Problem',
            accessor: 'problem',
          },
          {
            Header: 'Lost Time',
            accessor: 'lost',
          },
        ],
        []
      )

      // Actual rows to diplay in table. 
      // Derived from rawData. 
      // Data is wrapped with UI component.
      const data = React.useMemo(
        () => rawData.map((e) => ({
            id: e.id,
            name: e.name,
            line: e.line,
            lost: <MiniCardContainer dec>{e.lost}</MiniCardContainer>,
            problem: e.problem
        }))
        ,
        [rawData]
      )

  return (
    <Page>
      <Topbar title="Machine Breakdown" />
      <InitialGap />
      
      <Container style={{margin:"0px"}} fluid>

        {/* Filter */}
      <FlexRow>
            <Input type="date" defaultValue={selectedDate.toLocaleDateString('fr-CA')} value={selectedDate.toLocaleDateString('fr-CA')} onChange={onSetDate} />
      </FlexRow>
      <div css={css`height:2vh;`} />
      <SectionContainer>
        <Row>

        {/* summarized data (Total Defected, Total Lost, Most Frequent Type) */}
          <Coln sm={12} lg={6}>
          <div css={css`
                display: flex;
                flex-direction:'row';
                justify-content: space-evenly;
              `}>
                <div css={css`
                  display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                `}>
                  <PrimaryHeading1>
                  {aggData['total machine']}
                  </PrimaryHeading1>
                  <Caption>
                    Total Defected
                  </Caption>
                </div>
                <div css={css`border-left: 6px solid lightgray;height: 50px; border-radius: 3px; opacity:30%;`} />
                <div css={css`
                  display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;`} >
                <PrimaryHeading1>
                {aggData['total lost']} min
                  </PrimaryHeading1>
                  <Caption>
                   Total Lost
                  </Caption>
                </div>
                <div css={css`border-left: 6px solid lightgray;height: 50px; border-radius: 3px; opacity:30%;`} />
                <div css={css`
                  display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;`}>
                <PrimaryHeading1>
                {aggData['most type']}
                  </PrimaryHeading1>
                  <Caption>
                  Most Frequent Type
                  </Caption>
                </div>
              </div>
          </Coln>

          {/* Download Button */}
          <Coln sm={12} lg={6}>
            <div css={css`display:flex; justify-content:flex-end;padding:10px;`}>
              <ButtonOutline>Download as CSV</ButtonOutline>
            </div>
          </Coln>
        
        {/* Data Table */}
          <Coln sm={12} lg={12}>
          
          <DataGrid
            height={50}
              data={data}
              columns={columns}
              pageSize={12}
            />
          </Coln>
        </Row>
        </SectionContainer>
      </Container>
    </Page>
  )
}

export default MachineBreakdown