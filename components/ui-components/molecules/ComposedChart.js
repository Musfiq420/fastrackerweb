import React from 'react'
import { Bar, CartesianGrid, Cell, ComposedChart, LabelList, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const ComposedChartUI = ({charts, data, xDataKey, tooltip, customLabel, height}) => {
  return (
    <ResponsiveContainer height={height}>
      <ComposedChart
          margin={{
            top: 30,
            left:0
          }}
          data={data}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            axisLine={false}
            fontSize={14}
            dataKey={xDataKey}
          />
          <Tooltip content={tooltip} />
          <Legend />
          <YAxis
              axisLine={false}
              domain={[20, 85]}
              fontSize={10}
            />
          {/* <Tooltip content={<CustomTooltip />} /> */}
          {
            charts.map((e) => {
            
              if(e.type=="line")
                return (<Line
                  dataKey={e.dataKey}
                  stroke={e.color}
                  strokeWidth={2}
                  dot={false}
                  type="monotone"
                />)
              
              if(e.type=="bar")
                return (<Bar 
                  dataKey={e.dataKey} 
                  fill="#8884d8"
                >
                  
                <LabelList 
                  dataKey={e.dataKey} 
                  position="top" 
                  fontSize={14} 
                  content={customLabel}
                  />
                  {data?.map((entry, index) => (
                    <Cell
                      radius={5}
                      key={`cell-${index}`}
                      fill="#82ca9d"
                    />
                  ))}
              </Bar>)
            })
          }
          
        </ComposedChart>
    </ResponsiveContainer>
  )
}

export default ComposedChartUI