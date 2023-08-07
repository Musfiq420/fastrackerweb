import React, { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts'


const COLORS = ['#4FC3F7', '#00C49F', '#FFBB28', '#FF8042', 'gray', "lightGray"];


const PieDonut = ({data, dataKey, nameKey}) => {
  
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
          {`${data[index].name}: ${(percent * 100).toFixed(0)}%`}
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
    <ResponsiveContainer height={250} >
      <PieChart margin={{
            top:30,
            bottom:10,
            right:0,
            left:15
      }}>
        <Pie
          data={data}
          color="#000000"
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          innerRadius={"70%"}
          outerRadius={"90%"}
          fill="#8884d8"
          //  label={renderCustomizedLabel}
          activeShape={renderActiveShape}
          activeIndex={activeIndex}
          onMouseEnter={onPieEnter}
          labelLine={false}
        >
          {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
          ))}
        </Pie>
        {/* <Legend /> */}
      </PieChart>
    </ResponsiveContainer>
    
  )
}

export default PieDonut