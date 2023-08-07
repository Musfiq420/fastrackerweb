import React, { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Coln, FlexRow } from '@/components/ui-components/atoms/container';
import { Row } from 'react-grid-system';
import { H2, Sub } from '@/components/ui-components/atoms/text';
import styled from '@emotion/styled';
import { BlurryArea, FlexRowBetween,  LogoutModal, LogoutModalContent, OptionSidebar, SidebarHeaderContainer, SidebarUI } from '@/components/ui-components/atoms/container';
import { auth } from '@/lib/firebase';
import { Button } from '../ui-components/atoms/input';
import axios from 'axios';


const TopbarContainer = styled.div`
    width: 100%;
    height: 4rem;
    padding:15px;
    z-index:1500;  
    padding-left: 17%;
    position: fixed; 
    top: 0; 
    right:0;
    left: 0;
    background-color: white;
`


const Topbar = ({title}) => {
  const router = useRouter();
  const [name, setName] = useState("");

  const logout = async () => {
        signOut(auth).then(() => {
            router.push('/');
        });
    }

  return (
    <TopbarContainer>
      <Row align='center' justify="between">
        <Coln sm={12} md={6}>
          <Sub style={{fontSize:"24px"}}>{title}</Sub>
        </Coln>
        <Coln sm={12} md={6}>
          <FlexRow style={{justifyContent:"end"}}>
            <Sub style={{fontSize:"16px", marginRight:"15px"}}>{auth.currentUser.email}</Sub>
            <button style={{backgroundColor:"transparent", border:"none", cursor:"pointer", fontSize:"16px", marginRight:"15px"}} onClick={logout}>Log Out</button>
          </FlexRow>
          
        </Coln> 
      </Row>
    </TopbarContainer>
  )
}

export default Topbar