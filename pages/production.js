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
import { useSelector } from 'react-redux'
import { CSVLink } from 'react-csv'

// function to convert all raw efficiency data into chart friendly data
function aggregateData(input) {
  let manpower = 0;
  let production = 0;
  let totalEarnMin = 0;
  let totalAvailableMin = 0;

  for (let i = 0; i < input.length; i++) {
    const lineData = input[i];
    manpower += lineData['sam earners'];
    production += Number(lineData.output);
    totalEarnMin += lineData['earn min'];
    totalAvailableMin += lineData['available min'];
  }

  const efficiency = (totalEarnMin / totalAvailableMin) * 100;

  return {
    'man power': manpower,
    production,
    efficiency: efficiency.toFixed(2) + '%'
  };
}

const Production = () => {
    const recent = useSelector((state) => state.dates.recent);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [rawData, setRawData] = useState([]);

    const [styleData, setStyleData] = useState([]);

    // This function will be called to change date
    const onSetDate = async(event) => {
        const d = new Date(event.target.value)
        setSelectedDate(d);
      }

    const [selectedBlock, setSelectedBlock] = useState(0);
    
    // This function will be called to change block
    const onSetSelectedBlock = (e) => {
        setSelectedBlock(e.target.value); 
      }

    // Initial object schema with field for aggData state
    const [aggData, setAggData] = useState({
      'man power': 0,
      production:0,
      efficiency:  '0%'
    })

  // API call to get style wise efficiency data.
  // date is passed as parameter of the api
  // Result array is saved in styledata state
    const getAllStyleEfficiencyByDate = async(date) => {
      const res =  await axios.get('/api/getAllStyleEfficiencyByDate', {
          params: {
              date: date
          }
      });
      setStyleData(res.data);
    }

  // API call to get block wise efficiency data.
  // date is passed as parameter of the api
  // Result is passed in aggregateData function to get data to use in chart
  // Same data is also aggregated for summarized display (Man Power, Avg Cycle Time, Avg Capacity)
    const getBlockProductionByDate = async(date) => {
      const res =  await axios.get('/api/getBlockProductionByDate', {
        params: {
          date: date,
          lines: blockWiseLine[selectedBlock]
        }
      });
      console.log(res.data);
      const tempAgg = aggregateData(res.data);
      setAggData(tempAgg);
      setRawData(res.data);
    }

    // If selected date or selected block is updated then blockwise efficiency data and style wise efficiency data will be updated accordingly
    useEffect(() => {
      getBlockProductionByDate(selectedDate);
      getAllStyleEfficiencyByDate(selectedDate);
    }, [selectedDate, selectedBlock])

    // If recent date is updated then date will be updated to recent date, blockwise efficiency data and style wise efficiency data will be updated accordingly
    useEffect(() => {
      getBlockProductionByDate(new Date(recent));
      getAllStyleEfficiencyByDate(new Date(recent));
      setSelectedDate(new Date(recent));
    }, [recent])
    

  // Columns to display in Table. 
  // Header is the display name of the column and accessor is the field name of json object of rawData array
  const columns = React.useMemo(
        () => [
          {
            Header: 'Line',
            accessor: 'line',
          },
          {
            Header: 'Line',
            accessor: 'line',
          },
          {
            Header: 'Buyer',
            accessor: 'buyer'
          },
          {
            Header: 'SO',
            accessor: 'sfl'
          },
          {
            Header: 'Style',
            accessor: 'style'
          },
          {
            Header: 'Sam Earners',
            accessor: 'sam earners',
          },
          {
            Header: 'Net Prod',
            accessor: 'output',
          },
          {
            Header: 'Hrs',
            accessor: 'hours',
          },
          {
            Header: 'SMV',
            accessor: 'smv',
          },
          {
            Header: 'Efficiency',
            accessor: 'efficiency',
          },
        ],
        []
      )

      // Actual rows to diplay in table. 
      // Derived from rawData. 
      // Data is wrapped with UI component when needed using conditional rendering.
      const data = React.useMemo(
        () => rawData.map((value) => ({
          line: value.line,
          buyer: (value.buyer).split(",").map((e) => <div css={css`background-color:#f1f1f1; padding:5px; border-radius:3px;margin:1px; color:black; font-size:14px;`}>{e}</div>),
          sfl: (value.sfl).split(",").map((e) => <div css={css`background-color:#f1f1f1; padding:5px; border-radius:3px;margin:1px; color:black; font-size:14px;`}>{e}</div>),
          style: (value.style).split(",").map((e) => <div css={css`background-color:#f1f1f1; padding:5px; border-radius:3px;margin:1px; color:black; font-size:14px;`}>{e}</div>),
          'sam earners': <div css={css`margin:2px; color:black; font-size:14px;text-align:center;`}>{value['sam earners']}</div>,
          output: <div css={css`margin:2px; color:black;  font-size:14px;text-align:center;`}>{value.output}</div>,
          hours: <div css={css`margin:2px; color:black;  font-size:14px;text-align:center;`}>{value.hours}</div>,
          smv: (value.smv.toString()).split(",").map((e) => <div css={css`width:min-content;background-color:#f1f1f1; padding:5px; border-radius:3px;margin:1px; color:black; font-size:14px;`}>{e}</div>),
          efficiency: <MiniCardContainer inc>{value.efficiency}</MiniCardContainer> 
        }))
        ,
        [rawData]
      )

  return (
    <Page>
      <Topbar title="Sewing Production" />
      <InitialGap />
      
      <Container style={{margin:"0px"}} fluid>
      
      {/* Filters */}
      <FlexRow>
      <Select value={selectedBlock} onChange={onSetSelectedBlock}>
            {
            blockWiseLine.map((e, i) => (<option value={i}>Block: {e[0]} - {e[e.length - 1]}</option>))
            }
        </Select>
            <Input type="date" defaultValue={selectedDate.toLocaleDateString('fr-CA')} value={selectedDate.toLocaleDateString('fr-CA')} onChange={onSetDate} />
      </FlexRow>
      <div css={css`height:2vh;`} />
      <SectionContainer>
        <Row>

          {/* Manpower, Production and Efficiency */}
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
                {aggData.production}
                  </PrimaryHeading1>
                  <Caption>
                  Production
                  </Caption>
                </div>
                <div css={css`border-left: 6px solid lightgray;height: 50px; border-radius: 3px; opacity:30%;`} />
                <div css={css`
                  display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;`}>
                <PrimaryHeading1>
                {aggData.efficiency}
                  </PrimaryHeading1>
                  <Caption>
                  Efficiency
                  </Caption>
                </div>
              </div>
          </Coln>

          {/* Download Button */}
          <Coln sm={12} lg={6}>
            <div css={css`display:flex; justify-content:flex-end;padding:10px;`}>
              <ButtonOutline>
                <CSVLink filename={`efficiency file ${selectedDate.toLocaleDateString('fr-CA')}`} data={styleData}><span style={{color:'Highlight', textDecoration:"underline"}}>Download as CSV</span></CSVLink>
              </ButtonOutline>
            </div>
          </Coln>
        
          <Coln sm={12} lg={12}>
          {/* Data Table */}
          <DataGrid
            height={55}
              data={data}
              columns={columns}
              pageSize={10}
            />
          </Coln>
        </Row>
        </SectionContainer>
      </Container>
    </Page>
  )
}

export default Production