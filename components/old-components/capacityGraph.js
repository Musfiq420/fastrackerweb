import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Input, Option, Select } from '@/components/ui-components/atoms/input';
import { Coln, FlexRow, SectionContainer } from '../ui-components/atoms/container';
import { Container, Row } from 'react-grid-system';
import { H3 } from '../ui-components/atoms/text';
import { Divider } from '../ui-components/atoms/misc';
import Table from '../ui-components/molecules/Table';

const CapacityGraph = ({lineArray}) => {
    const [selectedDate, setSelectedDate] = useState(new Date('2022-12-20'));
    const [id, setId] = useState(null);
    const [data, setData] = useState([]);
    const [selectedLine, setSelectedLine] = useState(0);

    const getSkillMatrixByDateandLine = async() => {
      const res =  await axios.get('/api/getSkillMatrixByDateandLine', {
          params: {
              line: selectedLine,
              date: selectedDate
          }
      });
      console.log(res.data);
      setData(res.data);
  }

    const columns = React.useMemo(
        () => [
          {
            Header: 'ID',
            accessor: 'id', // accessor is the "key" in the data
          },
          {
            Header: 'Process Name',
            accessor: 'process', // accessor is the "key" in the data
          },
          {
            Header: 'Machine Name',
            accessor: 'machine', // accessor is the "key" in the data
          },
          {
            Header: 'Capacity',
            accessor: 'capacity',
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
            <H3>Capacity Graph</H3>
          </>
          </Coln>
          <Coln  md="content" xs={12}>
            <FlexRow>
              <Select value={selectedLine} onChange={(e) => setSelectedLine(e.target.value)} >
              {
              lineArray.map((e) => (<Option value={e}>{`Line ${e}`}</Option>))
              }
              </Select>
              <Input type="date" defaultValue={selectedDate.toLocaleDateString('fr-CA')} value={selectedDate.toLocaleDateString('fr-CA')} onChange={(e) => setSelectedDate(new Date(e.target.value))} />
              <Button onClick={getSkillMatrixByDateandLine}>Search</Button>
            </FlexRow>
          </Coln>
        </Row>
      </Container>
      <Divider />
      <Container fluid>
        <Row>
          <Coln>
            <Table
              data={data}
              columns={columns}
              pageSize={5}
              filename={`capacity-graph-${selectedDate.toLocaleDateString('fr-CA')}`}
            />
          </Coln>
        </Row>
      </Container>
    </SectionContainer>
    // <DashboardSection
    //   title="Capacity Graph"
    //   subTitle=""
    //   filterArray={[
    //                 {
    //                   filterType:"select",
    //                   data: {
    //                     value: selectedLine,
    //                     onChange: (e) => setSelectedLine(e.target.value),
    //                     options: lineArray.map((e) => ({value: e, title: `Line ${e}`}))
    //                   }
    //                 },
    //                 {
    //                   filterType:"input",
    //                   data: {
    //                     type: "date",
    //                     defaultValue: selectedDate.toLocaleDateString('fr-CA'),
    //                     value: selectedDate.toLocaleDateString('fr-CA'),
    //                     onChange: (e) => setSelectedDate(new Date(e.target.value))
    //                   }
    //                 },
    //                 {
    //                   filterType:"button",
    //                   data: {
    //                     title: 'Search',
    //                     onClick: getSkillMatrixByDateandLine
    //                   }
    //                 }
    //               ]}
    //   visuals={[
    //     {
    //       type: "table",
    //       data: {
    //         columns: columns,
    //         data: data,
    //         pageSize: 5
    //       }
    //     }
    //   ]}
    // />
    
  )
}

export default CapacityGraph