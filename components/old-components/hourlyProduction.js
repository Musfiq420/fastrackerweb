import axios from 'axios';
import useSWR from 'swr';
import React, { useEffect, useState } from 'react'
import { Option, Select } from '../ui-components/atoms/input';
import ComposedChartUI from '../ui-components/molecules/ComposedChart';
import RadialProgress from '../ui-components/molecules/RadialProgress';
import { Coln, FlexRow, SectionContainer } from '../ui-components/atoms/container';
import { Container, Row } from 'react-grid-system';
import { H3, Sub } from '../ui-components/atoms/text';
import { Divider } from '../ui-components/atoms/misc';

const url = '/api/getHourlyProduction';
const getReq = async(url, args) => {
  const value = await axios.get(url
    ,{
      params: args,
  })
  return value.data;
}

const HourlyProduction = ({lineArray}) => {
    const [selectedLine, setSelectedLine] = useState(0);
    const { data:hourlyProductionArray, isLoading:loading } = useSWR({url, args: {line: lineArray[selectedLine]}},() => getReq(url, {line: lineArray[selectedLine]}));
    
    const [achievement, setAchievement]  = useState([{ name: 'L1', value: 0 }]);
    const getAchievement = () => {
      let tempTarget = 0;
      let tempProduction = 0;
      if(hourlyProductionArray) {
        const target = hourlyProductionArray[8]?hourlyProductionArray[8].target:0;
        hourlyProductionArray.map((e) => {
          if(e.entry)
          {
            tempTarget += target;
            tempProduction += e.production;
          }
          
        })
        setAchievement([{ name: 'L1', value: tempTarget>0?Number(((tempProduction/tempTarget)*100).toFixed()):0 }]) 
      }
      else {
        setAchievement([{ name: 'L1', value: 0 }])
      }
    }

    const CustomLabel = props => {
      return (
        <g>
          {hourlyProductionArray[props.index].issue?
          <g>
            <rect x={props.viewBox.x+10} y={props.viewBox.y-46} fill="#FFAB00" height={20} width={20} rx={5} />
              <text x={props.viewBox.x+20} y={props.viewBox.y-31} fill="#fff" fontWeight='bold' textAnchor='middle'>
             !
              </text>
          </g>
          
          :null}
          <text x={props.viewBox.x+20} y={props.viewBox.y-7} fill="#111" textAnchor='middle'>
            {props.value}
          </text>
        </g>
      );
    };

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div style={{ backgroundColor: "white", opacity: 0.8 }}>
            <p
              style={{ margin: 5 }}
              className="label"
            >{payload[0].payload.target?`Target: ${payload[0].payload.target} pcs`:'no target'}</p>
           
            <p
              style={{ margin: 5 }}
              className="label"
            >{payload[0].payload.production?`Production: ${payload[0].payload.production} pcs`:'no production'}</p>
            <p
              style={{ margin: 5, color:'red' }}
              className="label"
            >{`${payload[0].payload.issue}`}</p>
          </div>
        );
      }
    
      return null;
    };

    useEffect(() => {
      getAchievement()
    }, [hourlyProductionArray])

    useEffect(() => {
      setSelectedLine(0);
    }, [lineArray])


  return (
    <SectionContainer>
      <Container fluid>
        <Row justify="between">
          <Coln md={6} xs={12} >
          <>
            <H3>Hourly Production and Achievement</H3>
            <Sub>{`Line-${lineArray[selectedLine]}`}</Sub>
          </>
          </Coln>
          <Coln  md="content" xs={12}>
            <FlexRow>
              <Select value={selectedLine} onChange={(e) => setSelectedLine(e.target.value)} >
                {
                  lineArray.map((e, i) => 
                  (<Option value={i}>{`Line ${e}`}</Option>)
                  )
                }
              </Select>
            </FlexRow>
          </Coln>
        </Row>
      </Container>
      <Divider />
      <Container fluid>
        <Row>
          <Coln xs={12} lg={8}>
            
                <ComposedChartUI 
                data={hourlyProductionArray}
                xDataKey="hour"
                tooltip= {<CustomTooltip />}
                customLabel= {<CustomLabel />}
                charts={[
                          {
                            type: 'bar',
                            dataKey: "production"
                          },
                          {
                            type: 'line',
                            dataKey: "target"
                          }
                      ]}
                  />
            
               
          </Coln>
          <Coln xs={12} lg={4}>
            <RadialProgress
                  data={achievement}
                  dataKey="value"
              />
          </Coln>
        </Row>
    </Container>
    </SectionContainer>
  )
}

export default HourlyProduction