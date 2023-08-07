import React, { useEffect, useState } from 'react'
import RadialProgress from '../ui-components/molecules/RadialProgress';
import { FlexRowBetween, MiniCardContainer, SectionContainer } from '../ui-components/atoms/container';
import { SectionHeading, Sub } from '../ui-components/atoms/text';
import Toggle from '../ui-components/molecules/Toggle';
import DataGrid from '../ui-components/molecules/Datagrid';
import { Option, Select } from '../ui-components/atoms/input';
import { useSelector } from 'react-redux';
import axios from 'axios';

const MachineBreakdown = () => {
  const [data, setData] = useState([]);
  const recent = useSelector((state) => state.dates.recent);
  const todayString = (new Date()).toLocaleDateString('fr-CA');
  
  // API call to get machine lost time data.
  // Date object of today is passed as parameter of the api
  // Result array is pushed in a new tempData array where "lost" field type is wrapped by MiniCardContainer Component
  // tempData is saved in data state
  const getMachineLostTimeByDate = async() => {
    console.log(recent)
    const res =  await axios.get('/api/getMachineLostTimeByDate', {
        params: {
            date: new Date(todayString)
        }
    });
    
    console.log(res.data);
    const tempData = [];
    (res.data).map((e)=> {
      
      tempData.push({
        id: e.id,
        type: e.name,
        line: e.line,
        lost: <MiniCardContainer dec>{e.lost}</MiniCardContainer>,
        reason: e.problem
      });
    })
    
    setData(tempData);
  }

  // If recent date is updated then data will be updated accordingly
  useEffect(() => {
    if(recent)
    {
      console.log("executing")
      getMachineLostTimeByDate();
    }
        
  }, [recent])

 // Columns to display in Table. 
  // Header is the display name of the column and accessor is the field name of json object of data array
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id'
      },
      {
        Header: 'Type',
        accessor: 'type'
      },
      {
        Header: 'Line',
        accessor: 'line'
      },
      {
        Header: 'Lost Time',
        accessor: 'lost'
      },
      {
        Header: 'Reason',
        accessor: 'reason'
      },
    ],
    []
  )

  return (
    <SectionContainer>
      
      {/* Header */}
      <FlexRowBetween>
        <SectionHeading>
          Machine Breakdown
        </SectionHeading>
        <Sub>Today</Sub>
      </FlexRowBetween>

      {/* Data Table */}
      <DataGrid
        columns={columns}
        data={data}
        pageSize={6}
        />
    </SectionContainer>
  )
}

export default MachineBreakdown