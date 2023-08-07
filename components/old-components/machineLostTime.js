import React, { useState } from 'react'
import useSWR from 'swr';
import axios from "axios";
import { Coln, FlexRow, SectionContainer } from '@/components/ui-components/atoms/container';
import { Container, Row } from 'react-grid-system';
import { H3 } from '@/components/ui-components/atoms/text';
import { Input } from '@/components/ui-components/atoms/input';
import { Divider } from '@/components/ui-components/atoms/misc';
import Table from '@/components/ui-components/molecules/Table';

const url = '/api/getMachineLostTimeByDate';
const getReq = async(url, args) => {
  const value = await axios.get(url, {
    params: args
  })

  // console.log(value.data)
  return value.data;
}

const MachineLostTime = () => {
  const [selectedDate, setSelectedDate] = useState(new Date('2023-02-19'));
  const onSetDate = async(event) => {
    const d = new Date(event.target.value)
    setSelectedDate(d);
  }
  const {data, isLoading} = useSWR({url, args: {date:selectedDate}},() => getReq(url, {date:selectedDate}));


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


  return (
    <SectionContainer>
      <Container fluid>
        <Row justify="between">
          <Coln md={6} xs={12} >
          <>
            <H3>Machine Breakdown</H3>
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
          <Coln sm={12} lg={12} >
            <Table
              data={isLoading?[]:data}
              columns={columns}
              pageSize={5}
            />
          </Coln>
        </Row>
      </Container>
    </SectionContainer>
    
  )
}

export default MachineLostTime