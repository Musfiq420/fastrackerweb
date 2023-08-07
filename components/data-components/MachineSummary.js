import React from 'react'
import { FlexRowBetween, SectionContainer } from '../ui-components/atoms/container'
import { SectionHeading } from '../ui-components/atoms/text'
import PieDonut from '../ui-components/molecules/PieChart'

const MachineSummary = () => {

  // All machine count
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

  // Sorted top 6 machines by number
  const sortedData = React.useMemo(
    () => [
      {name: "Single Needle", count: 1676},
      {name: "4T Over Lock", count: 963},
      {name: "Cyl. Bed Flat Lock", count: 605},
      {name: "Flat Bed Flat Lock", count: 181},
      {name: "Bartack M/C", count: 75},
      {name: "Others", count:574}
    ],
    []
  )

  


  return (
    <SectionContainer>
      <FlexRowBetween>
        <SectionHeading>
          Machine Summary
        </SectionHeading>
      </FlexRowBetween>
      
      {/* Pie Donut Chart */}
      <PieDonut
        data={sortedData}
        dataKey="count"
        nameKey="name"
      />
    </SectionContainer>
  )
}

export default MachineSummary