import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ProfileCard from '../ui-components/molecules/ProfileCard';
import SkillCard from '../ui-components/molecules/SkillCard';
import { Button, Input } from '@/components/ui-components/atoms/input';
import { Coln, FlexRow, SectionContainer } from '@/components/ui-components/atoms/container';
import { Container, Row } from 'react-grid-system';
import { H3, Sub } from '@/components/ui-components/atoms/text';
import { Divider } from '@/components/ui-components/atoms/misc';

const SkillMatrix = () => {
    const [id, setId] = useState(null);
    const [data, setData] = useState([]);
    const [employeeInfo, setEmployeeInfo] = useState([]);
    // const [selectedLine, setSelectedLine] = useState(0);

    // const [searchMode, setSearchMode] = useState('byLine');

    const getSkillMatrixById = async() => {
        const res =  await axios.get('/api/getSkillMatrixById', {
            params: {
                id: id
            }
        });
        console.log(res.data);
        setData(res.data);
    }

    const getEmployeeDataById = async() => {
      const res =  await axios.get('/api/getEmployeeById', {
          params: {
              id: id
          }
      });
      console.log(res.data);
      setEmployeeInfo(res.data);
  }

    const columns = React.useMemo(
        () => [
          {
            Header: 'ID',
            accessor: 'id', // accessor is the "key" in the data
          },
          {
            Header: 'Line',
            accessor: 'line', // accessor is the "key" in the data
          },
          {
            Header: 'Process Name',
            accessor: 'process', // accessor is the "key" in the data
          },
          {
            Header: 'Item',
            accessor: 'item',
          },
          {
            Header: 'Fabric Type',
            accessor: 'fabric',
          },
          {
            Header: 'Cycle Time',
            accessor: 'cycle',
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
            <H3>Skill Matrix</H3>
          </>
          </Coln>
          <Coln  md="content" xs={12}>
            <FlexRow>
              <Input defaultValue={id} value={id} onChange={(e) => setId(e.target.value)} />
              <Button 
                onClick={async() => {await getEmployeeDataById(); await getSkillMatrixById()}}
               >Search</Button>
            </FlexRow>
          </Coln>
        </Row>
      </Container>
      <Divider />
      <Container fluid>
        <Row>
          <Coln sm={6} lg={4}>
            <ProfileCard employeeInfo={employeeInfo} />
          </Coln>
          <Coln sm={6} lg={8}>
            <SkillCard processInfo={data} />
          </Coln>
          
        </Row>
      </Container>
    </SectionContainer>

  )
}

export default SkillMatrix