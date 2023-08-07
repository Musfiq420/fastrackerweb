import React, { useState } from 'react';
import useSWR from 'swr';
import axios from "axios";
import { properCase } from '@/lib/properCase';
import { Coln, FlexRow, SectionContainer } from '@/components/ui-components/atoms/container';
import { Container, Row } from 'react-grid-system';
import { H3, Sub } from '@/components/ui-components/atoms/text';
import { Input } from '@/components/ui-components/atoms/input';
import { Divider } from '@/components/ui-components/atoms/misc';
import SectionCard from '@/components/ui-components/molecules/SectionCard';

const url = '/api/getProductionDataByDateandDept';
const getReq = async(url, args) => {
  const value = await axios.get(url, {
    params: args
  })
  return value.data;
}

const DailyProduction = ({dept}) => {
  const [selectedDate, setSelectedDate] = useState(new Date('2022-12-20'));
  const { data:productionData, loading} = useSWR({url, args: {date:selectedDate, dept:dept}},() => getReq(url, {date:selectedDate, dept:dept}));

  const onSetDate = async(event) => {
    const d = new Date(event.target.value)
    setSelectedDate(d);
  }


  return (
    <SectionContainer>
      <Container fluid>
        <Row justify="between">
          <Coln md={6} xs={12} >
          <>
            <H3>Daily Report</H3>
            <Sub>{`${properCase(dept)}, ${selectedDate.toLocaleDateString("en-US",{
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`}</Sub>
          </>
          </Coln>
          <Coln  md="content" xs={12}>
            <FlexRow>
              <Input type="date" defaultValue={selectedDate.toLocaleDateString('fr-CA')} value={selectedDate.toLocaleDateString('fr-CA')} onChange={onSetDate} />
            </FlexRow>
          </Coln>
        </Row>
      </Container>
      <Divider />
      <Container fluid>
        <Row>
          <Coln sm={6} lg={3}>
            <SectionCard
              title="Man Power"
              loading={loading}
              value={productionData?.manPower}
            />
          </Coln>
          <Coln sm={6} lg={3}>
            <SectionCard
              title="Production"
              loading={loading}
              value={productionData?.production}
            />
          </Coln>
          <Coln sm={6} lg={3}>
            <SectionCard
              title="Achievement"
              loading={loading}
              value={`${productionData?.achievement}%`}
            />
          </Coln>
          <Coln sm={6} lg={3}>
            <SectionCard
              title="Efficiency"
              loading={loading}
              value={`${productionData?.efficiency}%`}
            />
          </Coln>
        </Row>
      </Container>
    </SectionContainer>
  )
}

export default DailyProduction