import { Content } from '@next/font/google';
import React, { useEffect, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { Cell, Legend, Pie, PieChart, Sector, Tooltip } from 'recharts';
import PieDonut from '@/components/ui-components/molecules/PieChart';
import { Coln, SectionContainer } from '@/components/ui-components/atoms/container';
import { Container, Row } from 'react-grid-system';
import { H3 } from '@/components/ui-components/atoms/text';
import { Divider } from '@/components/ui-components/atoms/misc';
import Table from '@/components/ui-components/molecules/Table';


const dataPie = [
  { id: "1", name: "L1", value: 25 },
  { id: "2", name: "L2", value: 75 }
];


const MachineType = ({title}) => {


  const data = React.useMemo(
    () => [
      {name: "Single Needle", count:1676},
      {name: "LA Single Needle", count:18},
      {name: "522 Single Needle", count:65},
      {name: "380 Single Needle", count:58},
      {name: "Cyl. Bed Flat Lock", count:605},
      {name: "Flat Bed Flat Lock", count:181},
      {name: "4T Over Lock", count:963},
      {name: "3T Over Lock", count:30},
      {name: "Roller Over Lock", count:25},
      {name: "Blind Hem Over Lock", count:35},
      {name: "Button Hole", count:53},
      {name: "Button Attach", count:55},
      {name: "Snap Button", count:55},
      {name: "Bartack M/C", count:75},
      {name: "Zig-zag M/C", count:20},
      {name: "Kansai M/C", count:53},
      {name: "Rib Cutter", count:30},
      {name: "Eyelet Hole", count:1},
      {name: "Smoke", count:3},
      {name: "Shuttle Stitch", count:2},
      {name: "Auto Cycle Sewing", count:13},
      {name: "Auto Back Moon Sewing", count:6},
      {name: "Auto Label Attach", count:10},
      {name: "Double Needle", count:36},
      {name: "Double Needle Chain", count:3},
      {name: "Feed of the Arm", count:48},
      {name: "Feed of the Arm VT", count:10},
      {name: "Other Machines", count:0}
    ],
    []
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'Machine Type',
        accessor: 'name', // accessor is the "key" in the data
      },
      {
        Header: 'Count',
        accessor: 'count',
      },
    ],
    []
  )

  useEffect(() => {
    console.log(data)
  })

  // const COLORS = ['#4FC3F7', '#00C49F', '#FFBB28', '#FF8042', 'gray'];

  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
    
      const RADIAN = Math.PI / 180;
      const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
          <g>
            <rect  x={cx} y={cy} dx={10} width={130} height={20} fill='white'   >

            </rect>
            <text x={x} y={y} fontSize={12} textAnchor='middle' dominantBaseline="central">
              {`${data[index].col1}: ${(percent * 100).toFixed(0)}%`}
            </text>
          </g>
          
        );
      };


      const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 5) * cos;
        const sy = cy + (outerRadius + 5) * sin;
        const mx = cx + (outerRadius + 15) * cos;
        const my = cy + (outerRadius + 15) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';
      
        return (
          <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
              {payload.name}
            </text>
            <Sector
              cx={cx}
              cy={cy}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={startAngle}
              endAngle={endAngle}
              fill={fill}
            />
            <Sector
              cx={cx}
              cy={cy}
              startAngle={startAngle}
              endAngle={endAngle}
              innerRadius={outerRadius + 6}
              outerRadius={outerRadius + 10}
              fill={fill}
            />
            {/* <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" /> */}
            {/* <circle cx={mx} cy={my} r={2} fill={fill} stroke="none" /> */}
            {/* <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text> */}
            <text x={mx} y={my}  textAnchor={textAnchor} fill="#999">
              {`${(percent * 100).toFixed(2)}%`}
            </text>
          </g>
        );
      };
      

    return (
      <SectionContainer>
        <Container fluid>
          <Row justify="between">
            <Coln md={6} xs={12} >
            <>
              <H3>Machine Types</H3>
            </>
            </Coln>
          </Row>
        </Container>
        <Divider />
        <Container fluid>
          <Row>
            <Coln sm={12} lg={6} >
              <Table
                data={data.sort((a, b) => b.count - a.count)}
                columns={columns}
                pageSize={4}
              />
            </Coln>
            <Coln sm={12} lg={6} >
              <PieDonut 
                data={data}
                dataKey="count"
                nameKey="name"
              />
            </Coln>
            
          </Row>
        </Container>
      </SectionContainer>  
    )
}

export default MachineType