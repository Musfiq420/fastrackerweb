import MachineLostTime from '@/components/old-components/machineLostTime';
import MachineTopbar from '@/components/layout/topbar'
import MachineType from '@/components/old-components/machineType';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { InitialGap, Page } from '@/components/ui-components/atoms/container';
import Topbar from '@/components/layout/topbar';

const Machine = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    console.log(isLoggedIn);
  }, [])

  return (
    <Page>
      <Topbar title="Machine Overview" />
      <InitialGap />
      <MachineType title={'Machine Types'} />
      <MachineLostTime />
    </Page>
  )
}

export default Machine