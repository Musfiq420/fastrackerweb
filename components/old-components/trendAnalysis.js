import React, { PureComponent, useState } from 'react';
import useSWR from 'swr';
import axios from "axios";
import ComposedChartUI from '@/components/ui-components/molecules/ComposedChart';
import { properCase } from '@/lib/properCase';
import { Coln, FlexRow, SectionContainer } from '../ui-components/atoms/container';
import { Container, Row } from 'react-grid-system';
import { H3, Sub } from '../ui-components/atoms/text';
import { Option, Select } from '../ui-components/atoms/input';
import { Divider } from '../ui-components/atoms/misc';

const url = '/api/getEfficiencyByDateRange';
const getReq = async(url, args) => {
  const value = await axios.get(url, {
    params: args
  })
  return value.data;
}

const TrendAnalysis = ({dept}) => {
  const today = new Date('2022-12-15');
  const [day, setDay] = useState("7");
  const { data:efficiencyArray, isLoading } = useSWR({url, args: {date:today, day, dept}},() => getReq(url, {date:today, day, dept}));

  return (
    <SectionContainer>
      <Container fluid>
        <Row justify="between">
          <Coln md={6} xs={12} >
          <>
            <H3>Trend Analysis</H3>
            <Sub>{`${properCase(dept)}, ${day==="7"?"Last Week":day==="30"?"Last Month":day==="90"?"Last 3 Months":day==="180"?"Last 6 Months":""}`}</Sub>
          </>
          </Coln>
          <Coln  md="content" xs={12}>
            <FlexRow>
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
          </Coln>
        </Row>
      </Container>
      <Divider />
      <Container fluid>
        <Row>
          <Coln >
            <ComposedChartUI
              charts={[
                          {
                            type:"line",
                            dataKey: "efficiency"
                          }
                        ]}
                        data={efficiencyArray}
            xDataKey="date"
              />
          </Coln>
        </Row>
      </Container>
    </SectionContainer>


    // <DashboardSection
    //   title="Trend Analysis"
    //   subTitle={`${properCase(dept)}, ${day==="7"?"Last Week":day==="30"?"Last Month":day==="90"?"Last 3 Months":day==="180"?"Last 6 Months":""}`}
    //   filterArray={[
    //     {
    //       filterType: "select",
    //       data: {
    //         value: day,
    //         onChange: (e) => setDay(e.target.value),
    //         options: [
    //           {
    //             value: 7,
    //             title: "Last Week"
    //           },
    //           {
    //             value: 30,
    //             title: "Last Month"
    //           },
    //           {
    //             value: 90,
    //             title: "Last 3 Months"
    //           },
    //           {
    //             value: 180,
    //             title: "Last 6 Months"
    //           }
    //         ]
    //       }
    //     }
    //   ]}
    //   visuals={[
    //     {
    //       type: "chart",
    //       data: {
    //         data: efficiencyArray,
    //         xDataKey:"date",
    //         charts:[
    //           {
    //             type:"line",
    //             dataKey: "efficiency"
    //           }
    //         ]
    //       }
    //     }
    //   ]}
    // />

    
  )
}

export default TrendAnalysis