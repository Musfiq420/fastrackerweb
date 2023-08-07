import React, {  useEffect, useState } from 'react';
import axios from "axios";
import ComposedChartUI from '@/components/ui-components/molecules/ComposedChart';
import { FlexRowBetween, SectionContainer } from '../ui-components/atoms/container';
import { SectionHeading } from '../ui-components/atoms/text';
import { Option, Select } from '../ui-components/atoms/input';

const url = '/api/getEfficiencyByDateRange';
const getReq = async(url, args) => {
  const value = await axios.get(url, {
    params: args
  })

  return value.data;
}

const TrendAnalysis = () => {
  const todayString = (new Date()).toLocaleDateString('fr-CA');
  const today = new Date(todayString);
  const [day, setDay] = useState("7");
  const [efficiencyArray, setEfficiencyArray] = useState(null);

  // If day option is updated then efficiency array will be updated by api call
  useEffect(() => {
    const result = getReq(url, {date:today, day});
    result.then((value) => setEfficiencyArray(value));
  }, [day])

  return (
    <SectionContainer>
      <FlexRowBetween>
        <SectionHeading>
          Efficiency Trend
        </SectionHeading>

        {/* Day range filter */}
        <Select value={day} onChange={(e) => setDay(e.target.value)} >
          {
            [
              {
                value: 7,
                title: "Last Week"
              },
              {
                value: 30,
                title: "Last Month"
              },
              {
                value: 90,
                title: "Last 3 Months"
              },
              {
                value: 180,
                title: "Last 6 Months"
              }
            ].map((e) => (<Option value={e.value}>{e.title}</Option>))
          }
        </Select>
      </FlexRowBetween>
      
      {/* Efficiency Chart */}
      <ComposedChartUI
        height={250}
        charts={[
                  {
                    type:"line",
                    dataKey: "cutting",
                    color: "#90AFFF"
                  },
                  {
                    type:"line",
                    dataKey: "sewing",
                    color: "#4DDC41"
                  },
                  {
                    type:"line",
                    dataKey: "embroidery",
                    color: "#FCCC50"
                  },
                  {
                    type:"line",
                    dataKey: "printing",
                    color: "purple"
                  },
                  {
                    type:"line",
                    dataKey: "finishing",
                    color: "#FF9595"
                  }
                ]}
        data={efficiencyArray}
        xDataKey="date"
        />
    </SectionContainer>
  )
}

export default TrendAnalysis