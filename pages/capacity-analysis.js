/** @jsxImportSource @emotion/react */
import Topbar from '@/components/layout/topbar'
import { Coln, FlexRow, InitialGap, Page } from '@/components/ui-components/atoms/container'
import { Button, ButtonOutline, Input, Option, Select as S } from '@/components/ui-components/atoms/input'
import DataGrid from '@/components/ui-components/molecules/Datagrid'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { blockWiseLine } from '@/lib/blockWiseLine';
import { Container, Row } from 'react-grid-system'
import { Caption, PrimaryHeading1, PrimaryHeading3 } from '@/components/ui-components/atoms/text'
import { css } from '@emotion/react'
import { SectionContainer } from '@/components/ui-components/atoms/container'
import { CSVLink } from 'react-csv'
import Dropdown from '@/components/ui-components/molecules/DropdownSearch'
import processCodeMap from "../lib/processCodeMap.json";
import Select  from 'react-select';


function convertObjectToArray(inputObj) {
  return Object.entries(inputObj).map(([key, value]) => ({
    value: key,
    label: value
  }));
}

function aggregateData(input) {
    const output = {
      "man power": 0,
      "avg cycle": 0,
      "avg capacity": 0
    };
  
    const uniqueIds = new Set();
    let totalCycle = 0;
    let totalCapacity = 0;
  
    for (const item of input) {
      uniqueIds.add(item.id);
      totalCycle += item.cycle;
      isNaN(item.capacity)? totalCapacity = totalCapacity : totalCapacity += parseFloat(item.capacity);
    }
  
    output["man power"] = uniqueIds.size;
    output["avg cycle"] = (totalCycle / input.length).toFixed(2);
    output["avg capacity"] = (totalCapacity / input.length).toFixed(2);
  
    return output;
  }

const CapacityAnalysis = () => {
    const processArray = convertObjectToArray(processCodeMap);

    const [selectedProcess, setSelectedProcess] = useState(processArray[484].value);
    
    const [selectedBlock, setSelectedBlock] = useState(0);
    const onSetSelectedBlock = (e) => {
        setSelectedBlock(e.target.value); 
      }

    const [data, setData] = useState([]);

    // Initial object schema with field for aggData state
    const [aggData, setAggData] = useState({
        "man power": 0,
        "avg cycle": 0,
        "avg capacity": 0
      });

      // API call to get block wise and process wise capacity data.
      // lines in a block and process code is passed as parameter of the api
      // Result array is saved in data state
      // Same data is also aggregated for summarized display (Man Power, Avg Cycle Time, Avg Capacity)
      const getSkillMatrixByProcess = async() => {
        const res =  await axios.get('/api/getSkillMatrixByProcess'
        
        , {
            params: {
                process: selectedProcess,
                lines: blockWiseLine[selectedBlock]
            }
        }
        
        );
        console.log(res.data);
        const tempAgg = aggregateData(res.data);
        setAggData(tempAgg);
        setData(res.data);
    }

    // If selected process or selected block is updated then blockwise and process wise capacity data will be updated accordingly
    useEffect(() => {
      getSkillMatrixByProcess();
    }, [selectedProcess, selectedBlock])

  // Columns to display in Table. 
  // Header is the display name of the column and accessor is the field name of json object of rawData array
  const columns = React.useMemo(
        () => [
          {
            Header: 'ID',
            accessor: 'id', // accessor is the "key" in the data
          },
          {
            Header: 'Date',
            accessor: 'date', // accessor is the "key" in the data
          },
          {
            Header: 'Line',
            accessor: 'line', // accessor is the "key" in the data
          },
          {
            Header: 'Process Name',
            accessor: 'process-name', // accessor is the "key" in the data
          },
          {
            Header: 'Machine',
            accessor: 'machine', // accessor is the "key" in the data
          },
          {
            Header: 'Cycle Time',
            accessor: 'cycle',
          },
          {
            Header: 'Capacity',
            accessor: 'capacity',
          }
        ],
        []
      )

      // Style for select component
      const customStyles = {
        control: base => ({
          ...base,
          fontSize: 12,
          height:35,
          minHeight: 35,
          width: 300
        })
      };


  return (
    <Page>
      <Topbar title="Capacity Analysis" />
      <InitialGap />
      
      <Container style={{margin:"0px"}} fluid>
      
      {/* Filters */}
      <FlexRow>
      <S value={selectedBlock} onChange={onSetSelectedBlock}>
        {
          blockWiseLine.map((e, i) => (<option value={i}>Block: {e[0]} - {e[e.length - 1]}</option>))
        }
        </S>
        <div>
          <Select styles={customStyles} defaultValue={processArray[484]} options={processArray} onChange={(e) => setSelectedProcess(e.value)}  />
        </div>
      </FlexRow>
      <div css={css`height:2vh;`} />
      <SectionContainer>
        <Row>

        {/* summarized display (Man Power, Avg Cycle Time, Avg Capacity) */}
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
                  {aggData['man power']}
                  </PrimaryHeading1>
                  <Caption>
                    Man Power
                  </Caption>
                </div>
                <div css={css`border-left: 6px solid lightgray;height: 50px; border-radius: 3px; opacity:30%;`} />
                <div css={css`
                  display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;`} >
                <PrimaryHeading1>
                {aggData['avg cycle']} sec
                  </PrimaryHeading1>
                  <Caption>
                  Avg Cycle Time
                  </Caption>
                </div>
                <div css={css`border-left: 6px solid lightgray;height: 50px; border-radius: 3px; opacity:30%;`} />
                <div css={css`
                  display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;`}>
                <PrimaryHeading1>
                {aggData['avg capacity']} pcs
                  </PrimaryHeading1>
                  <Caption>
                  Avg Capacity
                  </Caption>
                </div>
              </div>
          </Coln>
          
          {/* Download Button */}
          <Coln sm={12} lg={6}>
            <div css={css`display:flex; justify-content:flex-end;padding:10px;`}>
              <ButtonOutline>
                <CSVLink filename={"skill matrix 2023-06-13"} data={data}><span style={{color:'Highlight', textDecoration:"underline"}}>Download as CSV</span></CSVLink>
              </ButtonOutline>
            </div>
            
          </Coln>
        
        {/* Data Table */}
          <Coln sm={12} lg={12}>
          <DataGrid
            height={50}
              data={data}
              columns={columns}
              pageSize={9}
            />
          </Coln>
        </Row>
        </SectionContainer>
      </Container>
    </Page>
  )
}

export default CapacityAnalysis