import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Coln, FlexRow, SectionContainer } from '@/components/ui-components/atoms/container';
import { Container, Row } from 'react-grid-system';
import { H3, Sub } from '@/components/ui-components/atoms/text';
import { Button, Input, Option, Select } from '@/components/ui-components/atoms/input';
import { Divider } from '@/components/ui-components/atoms/misc';
import Table from '@/components/ui-components/molecules/Table';
import DataGrid from '../experiment/datagrid';

const EfficiencyTable = () => {
    const [selectedDate, setSelectedDate] = useState(new Date('2022-12-20'));
    const [data, setData] = useState([]);
    const [mode, setMode] = useState("line");

    const getAllStyleEfficiencyByDate = async() => {
      const res =  await axios.get('/api/getAllStyleEfficiencyByDate', {
          params: {
              date: selectedDate
          }
      });
      console.log(res.data);
      setData(res.data);
    }

    const getAllLineEfficiencyByDate = async() => {
      const res =  await axios.get('/api/getAllLineEfficiencyByDate', {
          params: {
              date: selectedDate
          }
      });
      console.log(res.data);
      setData(res.data);
  }

    const columns = React.useMemo(
        () => [
          {
            Header: 'Line',
            accessor: 'line', // accessor is the "key" in the data
            filter: true
          },
          {
            Header: 'Buyer',
            accessor: 'buyer', // accessor is the "key" in the data
            filter: true
          },
          {
            Header: 'SO',
            accessor: 'sfl',
            filter: true
          },
          {
            Header: 'Style',
            accessor: 'style',
            filter: true
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
            Header: 'W/O',
            accessor: 'without',
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
            Header: 'Avail Min',
            accessor: 'available min',
          },
          {
            Header: 'Due',
            accessor: 'due',
          },
          {
            Header: 'Earn Min',
            accessor: 'earn min',
          },
          {
            Header: 'Efficiency',
            accessor: 'efficiency',
          },
        ],
        []
      )


      // const data = React.useMemo(
      //   () => [
      //     {process: "Shoulder Join", item: "Tee", fabric: "Pique", cycle: 23.4},
      //     {process: "Neck Join", item: "Tee", fabric: "Pique", cycle: 53.8},
      //     {process: "Button Attach", item: "Tee", fabric: "Pique", cycle: 43.2}
      //   ],
      //   []
      // )

  return (
    <SectionContainer>
      <Container fluid>
        <Row justify="between">
          <Coln md={6} xs={12} >
          <>
            <H3>Efficiency Table</H3>
            <Sub>{`All Lines, ${selectedDate.toLocaleDateString("en-US",{
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`}</Sub>
          </>
          </Coln>
          <Coln  md="content" xs={12}>
            <FlexRow>
              <Select value={mode} onChange={(e) => setMode(e.target.value)} >
                <Option value="line">Line Wise</Option>
                <Option value="style">Style Wise</Option>
              </Select>
              <Input type="date" defaultValue={selectedDate.toLocaleDateString('fr-CA')} value={selectedDate.toLocaleDateString('fr-CA')} onChange={(e) => setSelectedDate(new Date(e.target.value))} />
              <Button onClick={mode==="line"?getAllLineEfficiencyByDate:getAllStyleEfficiencyByDate}>Search</Button>
            </FlexRow>
          </Coln>
        </Row>
      </Container>
      <Divider />
      <Container fluid>
        <Row>
          <Coln>
            <DataGrid
              data={data}
              columns={columns}
              pageSize={5}
            />
            {/* <Table
              data={data}
              columns={columns}
              pageSize={5}
              filename={`${selectedDate.toLocaleDateString('fr-CA')}`}
            /> */}
          </Coln>
        </Row>
      </Container>
    </SectionContainer>
  )
}

export default EfficiencyTable