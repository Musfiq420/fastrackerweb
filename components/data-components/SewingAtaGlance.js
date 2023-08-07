/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react'
import { FlexRowBetween,  MiniCardContainer, SectionContainer } from '../ui-components/atoms/container'
import { Caption, ComparisonText,  PrimaryHeading1, PrimaryHeading3, SectionHeading, Sub } from '../ui-components/atoms/text'
import { css } from '@emotion/react'
import GaugeChart from '../ui-components/molecules/GaugeChart'
import axios from 'axios'
import { useSelector } from 'react-redux';


const url = '/api/getSewingProductionofLastDate';
const getReq = async(url, args) => {
  const value = await axios.get(url, {
    params: args
  })  
  return value.data;
}

const SewingAtaGlance = () => {

  const [productionData, setProductionData] = useState(null);
  const [previousProductionData, setPreviousProductionData] = useState(null);
  const recent = useSelector((state) => state.dates.recent);
  const previous = useSelector((state) => state.dates.previous);

  // Get comparison % of production of recent date and production of the previous day of recent date
  const getComparison = (currentData, previousData) => {
    if(!currentData || !previousData)
      return "undefined";

    const dif = currentData - previousData;
    const per = ((dif/currentData)*100).toFixed(2);

    return per;
  }

  // Check Increment or Decrement of production of recent date compared to production of the previous day of recent date
  const getInc = (currentData, previousData) => {
    if(!currentData || !previousData)
      return true;

    if(currentData < previousData)
    {
      return false;
    }
    else {
      return true;
    }
  }

  // If recent date is updated then production data will be updated accordingly
  useEffect(() => {
    if(recent)
    {
      const result = getReq(url, {date: new Date(recent), dept:"Sewing"});
      result.then((value) => setProductionData(value));
    }
      
  }, [recent])

  // If previous date is updated then production data of previous date will be updated accordingly
  useEffect(() => {
    if(previous)
    {
      const result = getReq(url, {date: new Date(previous), dept:"Sewing"});
      result.then((value) => setPreviousProductionData(value));
    }
    
}, [previous])

  return (
      <SectionContainer>
        {/* Heading */}
        <FlexRowBetween>
          <SectionHeading>
            Sewing At a Glance
          </SectionHeading>
          <Sub>{`${(new Date(recent)).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`}</Sub>
        </FlexRowBetween>

        {/* Body */}
        <div css={css`
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height:80%;
        `}>
          {/* Efficiency and Production */}
          <div css={css`
            display: flex;
            justify-content: space-evenly;
            padding: 10px;
          `}>

            {/* Efficiency with Gauge chart */}
            <div css={css`
            padding: 5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            `}>
              <GaugeChart
              oR={30}
              value={productionData?.efficiency}
              stroke={10}
              />
              <PrimaryHeading1>{productionData?.efficiency}%</PrimaryHeading1>
              <div css={css`padding: 5px;`} />
              <Caption>Efficiency</Caption>
            </div>
            
            {/* Production Info with comparison */}
            <div css={css`
            padding: 5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            `}>
              <MiniCardContainer inc={getInc(productionData?.production, previousProductionData?.production)}>
                <ComparisonText  inc={getInc(productionData?.production, previousProductionData?.production)} >{getInc(productionData?.production, previousProductionData?.production)===true?"+":""} {getComparison(productionData?.production, previousProductionData?.production)}%</ComparisonText>
              </MiniCardContainer> 
              <p style={{fontSize:"10px", color:"gray",paddingBottom:"5px"}}>vs last day</p>                  
              <PrimaryHeading1>{productionData?.production}</PrimaryHeading1>
              <div css={css`padding: 5px;`} />
              <Caption>Production</Caption>
            </div>
          </div>
          
          {/* Manpower, Target and Achievement */}
          <div css={css`
            display: flex;
            justify-content: space-evenly;
          `}>
            <div css={css`
              display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            `}>
              <PrimaryHeading3>
              {productionData?.manPower}
              </PrimaryHeading3>
              <Caption>
                Man Power
              </Caption>
            </div>
            <div css={css`border-left: 6px solid lightgray;height: 50px; border-radius: 3px; opacity:30%;`} />
            <div css={css`
              display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;`} >
            <PrimaryHeading3>
            {productionData?.target}
              </PrimaryHeading3>
              <Caption>
                Target
              </Caption>
            </div>
            <div css={css`border-left: 6px solid lightgray;height: 50px; border-radius: 3px; opacity:30%;`} />
            <div css={css`
              display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;`}>
            <PrimaryHeading3>
            {productionData?.achievement}%
              </PrimaryHeading3>
              <Caption>
              Achievement
              </Caption>
            </div>
          </div>
        </div>
      </SectionContainer>
  )
}

export default SewingAtaGlance