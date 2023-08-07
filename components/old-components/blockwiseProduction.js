import axios from 'axios';
import React, { useState } from 'react';
import useSWR from 'swr';
import { blockWiseLine } from '@/lib/blockWiseLine';
import { Coln, FlexRow, SectionContainer } from '@/components/ui-components/atoms/container';
import { Container, Row } from 'react-grid-system';
import { H3, Sub } from '@/components/ui-components/atoms/text';
import { Input } from '@/components/ui-components/atoms/input';
import { Divider } from '@/components/ui-components/atoms/misc';
import SectionCard from '@/components/ui-components/molecules/SectionCard';

const url = '/api/getBlockDataByDate';
const getReq = async(url, args) => {
  const value = await axios.get(url
    ,{
      params: args,
  })
  if(url==='/api/getHourlyProduction') console.log(value.data)
  return value.data;
}

const BlockwiseProduction = ({selectedBlock}) => {

  const [selectedDate, setSelectedDate] = useState(new Date('2023-01-12'));
  const onSetDate = async(event) => {
    const d = new Date(event.target.value)
    setSelectedDate(d);
  }

  const { data:blockData, loading,mutate } = useSWR({url, args: {date:selectedDate, lines: blockWiseLine[selectedBlock]}},() => getReq(url, {date:selectedDate, lines: blockWiseLine[selectedBlock]}));

  return (
    <SectionContainer>
      <Container fluid>
        <Row justify="between">
          <Coln md={6} xs={12} >
          <>
            <H3>Blockwise Production Report</H3>
            <Sub>{`Lines- ${blockData?.lines?blockData.lines[0]:""}-${blockData?.lines?blockData.lines[blockData.lines.length-1]:""}, ${selectedDate.toLocaleDateString("en-US",{
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
              value={blockData?.manPower}
            />
          </Coln>
          <Coln sm={6} lg={3}>
            <SectionCard
              title="Production"
              loading={loading}
              value={blockData?.production}
            />
          </Coln>
          <Coln sm={6} lg={3}>
            <SectionCard
              title="Achievement"
              loading={loading}
              value={`${blockData?.achievement}%`}
            />
          </Coln>
          <Coln sm={6} lg={3}>
            <SectionCard
              title="Efficiency"
              loading={loading}
              value={`${blockData?.efficiency}%`}
            />
          </Coln>
        </Row>
    </Container>
    </SectionContainer>
  )
}

export default BlockwiseProduction