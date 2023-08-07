import React from 'react'
import { Bar, BarChart, Cell, ComposedChart, LabelList, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'



const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length && payload[0].payload.issue) {
    return (
      <div style={{backgroundColor: "white", opacity:0.7}}>
        {/* <p
          style={{ margin: 5, fontSize:12 }}
          className="label"
        >{payload[0].payload.target?`Target: ${payload[0].payload.target} pcs`:'no target'}</p>
       
        <p
          style={{ margin: 5, fontSize:12 }}
          className="label"
        >{payload[0].payload.production?`Production: ${payload[0].payload.production} pcs`:'no production'}</p> */}
        <p
          style={{ margin: 5, color:'red', fontSize:12 }}
          className="label"
        >{`${payload[0].payload.issue}`}</p>
      </div>
    );
  }

  return null;
};


const MiniBarChartUI = ({data, dataKey, targetKey,  yDataKey}) => {

  const customLabel = props => {
    console.log("issue:"+data[props.index].issue);
    return (
      <g>
        {data[props.index].issue?
        <g>
          <circle cx={props.viewBox.x+10} cy={props.viewBox.y-10} fill="#FFAB00"  r={10} />
          {/* <rect x={props.viewBox.x-15} y={props.viewBox.y-20} fill="#FFAB00" height={20} width={50} rx={5} /> */}
            <text x={props.viewBox.x+8} y={props.viewBox.y-6} width={40}  fill="white" fontSize={16} textAnchor='start'>
              !
            </text>
            
        </g>
        
        :null}
        <text x={props.viewBox.x+10} y={data[props.index].issue?props.viewBox.y-23:props.viewBox.y-7} fill="#111" fontSize={12} textAnchor='middle'>
            {props.value?props.value:""}
          </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width={data.length*10} height={50}>
      <ComposedChart  margin={{top:0, bottom:0, left:0, right:0}} data={data}>
        <Tooltip wrapperStyle={{zIndex: 1000}} content={CustomTooltip} />
        <Bar 
        isAnimationActive={false}
                  barSize={10}
                  dataKey={dataKey} 
                  fill="#0C9C00"
                  opacity={0.5}
                  // label={customLabel}
                >
                 
                  {data?.map((entry, index) => (
                    <Cell
                      radius={2}
                      key={`cell-${index}`}
                      fill="#0C9C00"
                    />
                  ))}
              </Bar>
        <Line strokeWidth={2} type="monotone" dataKey={targetKey} dot={false} stroke="#ff7300" opacity={0.5} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default MiniBarChartUI