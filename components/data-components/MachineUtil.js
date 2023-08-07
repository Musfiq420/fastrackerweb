import React, { useState } from 'react'
import RadialProgress from '../ui-components/molecules/RadialProgress';
import { FlexRowBetween, SectionContainer } from '../ui-components/atoms/container';
import { SectionHeading } from '../ui-components/atoms/text';
import Toggle from '../ui-components/molecules/Toggle';
import DataGrid from '../ui-components/molecules/Datagrid';

const MachineUtil = () => {

  // Machne utilization %
  // Static demo values
  // For demo pupose
  const percentData1 = [{ name: 'L1', value: 97.39 }];
  const percentData2 = [{ name: 'L1', value: 96.94 }];
  const percentData3 = [{ name: 'L1', value: 95.08 }];

  // Columns to display in Table. 
  // Header is the display name of the column and accessor is the field name of json object array of data
  const columns = React.useMemo(
    () => [
      {
        Header: 'Machine Name',
        accessor: 'name'
      },
      {
        Header: 'Quantity',
        accessor: 'qty'
      },
      {
        Header: 'Active',
        accessor: 'active'
      },
      
      {
        Header: 'Percentage',
        accessor: 'percentage'
      },
    ],
    []
  )


  // Actual rows to diplay in table. 
  // Data is wrapped with UI component when needed.
  const data = React.useMemo(
    () => [
      {name:"Single Needle", qty: 1612, active: 1570, percentage: <RadialProgress data={percentData1} dataKey="value" height={70} /> },
      {name:"Over Lock", qty: 721, active: 699, percentage: <RadialProgress data={percentData2} dataKey="value" height={70} /> },
      {name:"Flat Lock", qty: 549, active: 533, percentage: <RadialProgress data={percentData3} dataKey="value" height={70} /> },
    ],
    []
  )

  return (
    <SectionContainer>

      {/* Header */}
      <FlexRowBetween>
        <SectionHeading>
          Machine Utilization
        </SectionHeading>
      </FlexRowBetween>

      {/* Data Table */}
      <DataGrid
        columns={columns}
        data={data}
        pageSize={3}
        />
    </SectionContainer>
  )
}

export default MachineUtil