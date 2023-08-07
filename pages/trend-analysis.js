/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react'
import { blockWiseLine } from '@/lib/blockWiseLine';
import { Coln, FlexRow, InitialGap, Page, SectionContainer } from '@/components/ui-components/atoms/container';
import Topbar from '@/components/layout/topbar';
import { Container, Row } from 'react-grid-system';
import { Input, Option, Select } from '@/components/ui-components/atoms/input';
import axios from 'axios';
import ComposedChartUI from '@/components/ui-components/molecules/ComposedChart';
import { Caption, PrimaryHeading1 } from '@/components/ui-components/atoms/text';
import { css } from '@emotion/react';


// function to convert all raw efficiency data with the given date range into chart friendly data
function aggregateData(input) {
    let manpower = 0;
    let production = 0;
    let totalEarn = 0;
    let totalAvailable = 0;
  
    for (let i = 0; i < input.length; i++) {
      const dateData = input[i];
      manpower += dateData.manPower;
      production += dateData.production;
      totalEarn += dateData.earn;
      totalAvailable += dateData.avail;
    }
  
    const efficiency = (totalEarn / totalAvailable) * 100;
  
    return {
      'man power': manpower,
      production,
      efficiency: efficiency.toFixed(2) + "%"
    };
  }
  

const TrendAnalysis = () => {
    const [data, setData] = useState([])
    const [selectedBlock, setSelectedBlock] = useState(0);
    const onSetSelectedBlock = (e) => {
        setSelectedBlock(e.target.value); 
      }

    // data mode: efficiency or production
    const [mode, setMode] = useState("efficiency");


    const todayString = (new Date()).toLocaleDateString('fr-CA');
    const today = new Date(todayString);
    const [day, setDay] = useState(30);

    // Initial object schema with field for aggData state
    const [aggData, setAggData] = useState({
        'man power': 0,
        production:0,
        efficiency:  '0%'
      })

  // API call to get block wise efficiency data within given date range.
  // date, day and lines in a block is passed as parameter of the api
  // date means the starting day of range and (date + day) means the ending day of range
  // Result array is saved in data state
  // Same data is also aggregated for summarized display (Man Power, Production, Efficiency)
    const getEfficiencyByBlockDateRange = async() => {
        const res =  await axios.get('/api/getEfficiencyByBlockDateRange', {
            params: {
                date: today,
                day: day,
                lines: blockWiseLine[selectedBlock]
            }
        });
        console.log(res.data);
        const tempAgg = aggregateData(res.data);
        setAggData(tempAgg);
        setData(res.data);
    }

      // If selected block or day is updated then blockwise efficiency data with given date range will be updated accordingly
      useEffect(() => {
        getEfficiencyByBlockDateRange();
    }, [selectedBlock, day])

  return (
    <Page>
      <Topbar title="Trend Analysis" />
      <InitialGap />
      <Container style={{margin:"0px"}} fluid>
      
      {/* Header */}
      <FlexRow>
        <Select value={selectedBlock} onChange={onSetSelectedBlock}>
            {
            blockWiseLine.map((e, i) => (<option value={i}>Block: {e[0]} - {e[e.length - 1]}</option>))
            }
        </Select>
        <Select value={day} onChange={(e) => setDay(e.target.value)} >
              {
                [
                  {
                    value: 7,
                    title: "Last Week"
                  },
                  {
                    value: 30,
                    title: "Last Month"
                  },
                  {
                    value: 90,
                    title: "Last 3 Months"
                  },
                  {
                    value: 180,
                    title: "Last 6 Months"
                  }
                ].map((e) => (<Option value={e.value}>{e.title}</Option>))
              }
            </Select>
            
      </FlexRow>
      <div css={css`height:2vh;`} />


      <SectionContainer>
        <Row>

        {/* Mapower, Production and Efficiency */}
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

          {/* Filters */}
          <Coln sm={12} lg={6}>
            <div css={css`display:flex; justify-content:flex-end;padding:10px;`}>
            <Select value={mode} onChange={(e) => setMode(e.target.value)}>
              <Option value="efficiency">Efficiency</Option>
              <Option value="production">Production</Option>
            </Select>
            </div>
          </Coln>

          {/* Chart */}
          <Coln sm={12} lg={12}>
            <ComposedChartUI
              height={350}
              charts={[
                          {
                              type:"line",
                              dataKey: mode
                          }
                          ]}
                          data={data}
              xDataKey="date"
              />
          </Coln>
        </Row>
        </SectionContainer>
      </Container>
    </Page>
  )
}

export default TrendAnalysis