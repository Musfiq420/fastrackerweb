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

// function to convert all bundle info data into summarized data (Cutting Input, Quality Pass, Sewing Output)
function countPiecesByStation(input) {
    const output = {
        "Cutting Input": 0,
        "Quality Pass": 0,
        "Sewing Output": 0
    };
  
    for (let i = 0; i < input.length; i++) {
      const station = input[i].station;
      const serial = input[i].serial;
      const [start, end] = serial.split('-');
      const count = parseInt(end) - parseInt(start) + 1;
  
      if (output[station]) {
        output[station] += count;
      } else {
        output[station] = count;
      }
    }
  
    return output;
  }

const Tracking = () => {
    const [rawData, setRawData] = useState([]);

    // Initial object schema with field for aggData state
    const [aggData, setAggData] = useState({
        "Cutting Input": 0,
        "Quality Pass": 0,
        "Sewing Output": 0
      });

    // API call to get bundle info data.
    // Result array is saved in rawData state
    // Same data is also aggregated for summarized data (Cutting Input, Quality Pass, Sewing Output)
    const getBundleTracking = async() => {
        const res =  await axios.get('/api/getBundleTracking');
        console.log(JSON.stringify(res.data));

        const tempAgg = countPiecesByStation(res.data);
        setAggData(tempAgg);
        setRawData(res.data);
    }

    // Data is retrieved first time
    useEffect(() => {
        getBundleTracking();
    }, [])

  // Columns to display in Table. 
  // Header is the display name of the column and accessor is the field name of json object of rawData array
  const columns = React.useMemo(
        () => [
          {
            Header: 'Docket No',
            accessor: "docket no", // accessor is the "key" in the data
          },
          {
            Header: 'Buyer',
            accessor: 'buyer',
          },
          {
            Header: 'Style',
            accessor: 'style',
          },
          {
            Header: 'SO',
            accessor: 'so',
          },
          {
            Header: 'Color',
            accessor: 'color',
          },
          {
            Header: 'Size',
            accessor: 'size',
          },
          {
            Header: 'Part',
            accessor: 'part',
          },
          {
            Header: 'Serial',
            accessor: 'serial',
          },
          {
            Header: 'Station',
            accessor: 'station',
          },
        ],
        []
      )

  return (
    <Page>
      <Topbar title="Production Tracking System" />
      <InitialGap />
      
      <Container style={{margin:"0px"}} fluid>
      <FlexRow>
      </FlexRow>
      <div css={css`height:2vh;`} />
      <SectionContainer>
        <Row>

        {/* summarized data (Cutting Input, Quality Pass, Sewing Output) */}
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
                  {aggData['Quality Pass']}
                  </PrimaryHeading1>
                  <Caption>
                    Quality Pass
                  </Caption>
                </div>
                <div css={css`border-left: 6px solid lightgray;height: 50px; border-radius: 3px; opacity:30%;`} />
                <div css={css`
                  display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;`} >
                <PrimaryHeading1>
                {aggData['Cutting Input']}
                  </PrimaryHeading1>
                  <Caption>
                    Cutting Input
                  </Caption>
                </div>
                <div css={css`border-left: 6px solid lightgray;height: 50px; border-radius: 3px; opacity:30%;`} />
                <div css={css`
                  display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;`}>
                <PrimaryHeading1>
                {aggData['Sewing Output']}
                  </PrimaryHeading1>
                  <Caption>
                    Sewing Output
                  </Caption>
                </div>
              </div>
          </Coln>
         
        
          <Coln sm={12} lg={12}>
          
          {/* Data Table */}
          <DataGrid
            height={50}
              data={rawData}
              columns={columns}
              pageSize={4}
            />
          </Coln>
        </Row>
        </SectionContainer>
      </Container>
    </Page>
  )
}

export default Tracking