import React, { useEffect, useState } from 'react';
import { Coln, InitialGap, Page } from '@/components/ui-components/atoms/container';
import Topbar from '@/components/layout/topbar';
import SewingAtaGlance from '@/components/data-components/SewingAtaGlance';
import { Container, Row } from 'react-grid-system';
import DeptSummary from '@/components/data-components/DeptSummary';
import TrendAnalysis from '@/components/data-components/TrendAnalysis';
import BlockSummary from '@/components/data-components/BlockSummary';
import HourlyProduction from '@/components/data-components/HourlyProduction';
import MachineSummary from '@/components/data-components/MachineSummary';
import MachineUtil from '@/components/data-components/MachineUtil';
import MachineBreakdown from '@/components/data-components/MachineBreakdown';
import axios from 'axios';
import { setDates } from '@/store/slices/datesSlice';
import { useDispatch } from 'react-redux';

const Performance = () => {
  const [hydration, setHydration] = useState(false);
  const dispatch = useDispatch();

  // Recent Date is the last date when production info of sewing section is given through app.
  // Recent Date is got from the api call and the result is stored in redux which will be used by other components
  const getRecentDate = async() => {
    const res = await axios.get('/api/getRecentDate');
    console.log(res.data);
    dispatch(setDates({recent:res.data[0], previous: res.data[1]}));
  }

  useEffect(() => {
    setHydration(true);
    getRecentDate();
  }, [])

  // hydration is used to wait and show loading screen untill useeffect is called. it is used to avoid errors.
  if(!hydration)
    return <p>Loading...</p>

  return (
    <Page>
      
      {/* Topbar */}
      <Topbar title="Welcome" />
      <InitialGap />

      {/* Main Screen */}
      <Container style={{margin:"10px"}} fluid>
        <Row>
          <Coln sm={12} lg={5}>
            <SewingAtaGlance />
          </Coln>
          <Coln sm={12} lg={7}>
            <DeptSummary />
          </Coln>
        </Row>
        <Row>
          <Coln sm={12} lg={7}>
            <TrendAnalysis />
          </Coln>
          <Coln sm={12} lg={5}>
            <BlockSummary />
          </Coln>
        </Row>
        <Row>
          <Coln sm={12} lg={8}>
            <HourlyProduction />
          </Coln>
          <Coln sm={12} lg={4}>
            <MachineSummary />
          </Coln>
        </Row>
        <Row>
          <Coln sm={12} lg={5}>
            <MachineUtil />
          </Coln>
          <Coln sm={12} lg={7}>
            <MachineBreakdown />
          </Coln>
        </Row>
        
      </Container>
      
    </Page>
  )
}


export default Performance