import Topbar from '@/components/layout/topbar'
import { Coln, FlexRow, InitialGap, Page, SectionContainer } from '@/components/ui-components/atoms/container'
import { Input, Select } from '@/components/ui-components/atoms/input'
import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-grid-system'
import { css } from '@emotion/react'
import axios from 'axios'
import DataGrid from '@/components/ui-components/molecules/Datagrid'


const defectTypeMapping = {
  "211": "Shade in Garment",
  "221": "Dirty Spot",
  "222": "Oil Spot",
  "224": "Pen Mark",
  "226": "Rust/Stain",
  "231": "Thick and Thin/Lycra Out",
  "232": "Slub",
  "233": "Yarn Contamination/PP/Fly",
  "234": "Fabric Hole",
  "237": "Needle Mark",
  "238": "Bowing",
  "311": "Missing Stitches",
  "312": "Broken Stitches",
  "313": "Wrong (SPI)",
  "314": "No Tack/No Backstitch",
  "315": "Slanted",
  "316": "Wrong Tension (Loose/Tight)",
  "317": "Skipped/Drop Stitch",
  "318": "Over Stitch",
  "319": "Contrast Thread Visible",
  "320": "Wrong Position",
  "321": "Roping",
  "326": "Needle Cut/Hole/Damage",
  "327": "Pleat",
  "328": "Raw Edge (Uneven)",
  "331": "Twisting",
  "332": "Puckering",
  "334": "Label Mistake",
  "335": "Unbalanced/Uneven Seams/Talpart",
  "336": "Open Seam",
  "337": "Cracking",
  "338": "Shining Mark",
  "339": "Seam Reverse",
  "343": "Uneven (Tape,Piping,Rib-Collar/Cuff)",
  "347": "Gathering (Bias/Uneven)",
  "355": "Poor Shape",
  "361": "Button/Snap/Zipper/Eyelet Not Functioning",
  "363": "Wrong Trims Position (Buttons, Snaps, Rivets, Eyelet)",
  "364": "Not Aligned (Buttons, Snaps, Rivets, Eyelet)",
  "365": "Wrong Placement/Spacing/Off Centered (Label, Buttons, Snaps)",
  "366": "Reverse Attach (All Label, Tape, Collar, Cuff, Button)",
  "367": "Button Half Stitch",
  "371": "Wrong Material",
  "381": "Trims Missing",
  "383": "Wrong Information in Trims (Care, Main, Size, Country, Security)",
  "384": "Poor Quality Trims (Care, Main, Size, Country, Security)",
  "392": "Stripes Not Matching",
  "401": "Uncut Thread",
  "405": "Sticker in the Garments",
  "408": "Wavy Stitch (Armhole + Neck Top Stitch + Sleeve + Bottom + Cuff)",
  "409": "Bias Grainline (Tape, Neck Binding, Side Slit)"
}

// Calculate overall total defect in number
function calculateTotalSum(inputArray) {
  let totalSum = 0;

  inputArray.forEach((item) => {
    if ('total' in item && typeof item.total === 'number') {
      totalSum += item.total;
    }
  });

  return totalSum;
}


// Calculate line wise aggregation
function calculateAggregation(inputArray) {
    const aggregationMap = new Map();
  
    // Loop through the input array and calculate the aggregation
    inputArray.forEach((item) => {
      const lineNumber = item.lineNumber;
  
      // Initialize the line aggregation entry if it doesn't exist
      if (!aggregationMap.has(lineNumber)) {
        aggregationMap.set(lineNumber, { lineNumber, total: 0 });
      }
  
      const lineAggregation = aggregationMap.get(lineNumber);
  
      // Loop through the keys of the item to find defect type codes
      Object.keys(item).forEach((key) => {
        if (key in defectTypeMapping) {
        //   const defectTypeTitle = defectTypeMapping[key];
          lineAggregation[key] = (lineAggregation[key] || 0) + item[key];
          lineAggregation.total++;
        }
      });
    });
  
    // Convert the aggregation map to an array of objects
    const outputArray = Array.from(aggregationMap.values());
  
    return outputArray;
  }

const QMS = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [rawData, setRawData] = useState([]);
    const [totalSum, setTotalSum] = useState(0);
    
    const onSetDate = async(event) => {
        const d = new Date(event.target.value)
        setSelectedDate(d);
    }

    // API call to get qms data in a given date.
    // date is passed as parameter of the api
    // Result array is saved in rawData state
    const getQMSData = async(date) => {
        const res =  await axios.get('/api/getQMSData', {
          params: {
            date: date
          }
        });
        
        const tempAgg = calculateAggregation(res.data);
        console.log(tempAgg);
        // setAggData(tempAgg);
        setRawData(tempAgg);
        
        setTotalSum(calculateTotalSum(tempAgg));
      }
  
      useEffect(() => {
        getQMSData(selectedDate);
      }, [selectedDate])

      const columns = React.useMemo(
        () => [
          {
            Header: <p style={{fontSize:12}}>Line</p>,
            accessor: 'line', // accessor is the "key" in the data
          },
          {
            Header: <p style={{fontSize:12}}>Dirty Spot</p>,
            accessor: 'Dirty Spot', // accessor is the "key" in the data
          },
          {
            Header: <p style={{fontSize:12}}>Oil Spot</p>,
            accessor: 'Oil Spot', // accessor is the "key" in the data
          },
          {
            Header: <p style={{fontSize:12}}>Uncut Thread</p>,
            accessor: 'Uncut Thread', // accessor is the "key" in the data
          },
          {
            Header: <p style={{fontSize:12}}>Yarn Contamination/<br/>PP/Fly</p>,
            accessor: 'Yarn Contamination/PP/Fly', // accessor is the "key" in the data
          },
          {
            Header: <p style={{fontSize:12}}>Shining Mark</p>,
            accessor: 'Shining Mark',
          },
          {
            Header: <p style={{fontSize:12}}>Defect(%)</p>,
            accessor: 'Defect(%)',
          },
        ],
        []
      )

      const data = React.useMemo(
        () => rawData.map((value) => ({
          line: value.lineNumber,
          "Dirty Spot": value['221']?((value['221']/value['total'])*100).toFixed(2)+"%":0+"%",
          "Oil Spot": value['222']?((value['222']/value['total'])*100).toFixed(2)+"%":0+"%",
          "Uncut Thread": value['401']?((value['401']/value['total'])*100).toFixed(2)+"%":0+"%",
          "Yarn Contamination/PP/Fly": value['233']?((value['233']/value['total'])*100).toFixed(2)+"%":0+"%",
          "Shining Mark": value['338']?((value['338']/value['total'])*100).toFixed(2)+"%":0+"%",
          "Defect(%)": ((value['total']/totalSum)*100).toFixed(2)+"%"
        }))
        ,
        [rawData]
      )


    return (
        <Page>
          <Topbar title="QMS" />
          <InitialGap />
          
          <Container style={{margin:"0px"}} fluid>
            <FlexRow>
              <Input type="date" defaultValue={selectedDate.toLocaleDateString('fr-CA')} value={selectedDate.toLocaleDateString('fr-CA')} onChange={onSetDate} />   
            </FlexRow>
            <div css={css`height:2vh;`} />
            <SectionContainer>
              <Row>
                <Coln sm={12} lg={12}>
                  <DataGrid
                    height={50}
                    data={data}
                    columns={columns}
                    pageSize={9}
                    />
                </Coln>
              </Row>
            </SectionContainer>
          </Container>
        </Page>
  )
}

export default QMS