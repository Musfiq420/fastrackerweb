import React from 'react'
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts'

const RadialProgress = ({data, dataKey, height}) => {
  return (
    <ResponsiveContainer width={height} height={height}>
      <RadialBarChart
        margin={{
          top: 0,
        }}
        innerRadius={"80%"}
        outerRadius={"110%"}
        barSize={"10%"}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background
          clockWise
          dataKey={dataKey}
          cornerRadius={0}
          fill="#0C9C00"
          opacity={0.5}
        />
        <text
          x={"50%"}
          y={"50%"}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fill: "#4CAF50" }}
          fontSize={12}
          // fontWeight={"bold"}
        >
          {data[0][dataKey]}%
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  )
}

export default RadialProgress