import { bp } from '@/lib/breakpoints'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Col } from 'react-grid-system'

export const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
`

export const FlexCol = styled.div`
    display: flex;
    flex-direction: column;
`

export const FlexRowBetween = styled(FlexRow)`
    justify-content: space-between;
`
export const Coln = styled(Col)`
    padding: 5px !important;
` 
// new
export const MiniCardContainer = styled.div`
    padding: 5px;
    font-size: 14px;
    color: ${props => props.inc?"#0C9C00":"#AC1616"};
    background-color: ${props => props.inc?"#EDFFF8":"#FFF2F2"}; 
    border-radius: 5px;
    width: fit-content;
`

export const CardContainer = styled.div`
    display: flex;
    background-color: #E8F5E9; 
    padding: 10px; 
    
    border: 1px solid #B9F6CA;
    border-radius: 5px;
`


export const SectionContainer = styled.div`
    padding: 15px;
    background-color: white; 
    border-radius: 5px; 
    border: 1px solid rgb(240, 240, 240);
    height: 100%;
`

export const FlexRowCenter = styled.div`
    display: flex;
    flex:1;
    justify-content: center;
    align-items: center;
`

export const FlexColCenter = styled.div`
    display: flex;
    flex-direction: column;
    flex:1;
    justify-content: center;
    align-items: self-start;
`




export const BlurryArea = styled.div`
    display: ${props => props.menuOpen?"block":"none"};
    width: 30%;
    position: fixed;
    z-index: 2000;
    ${bp.tablet} {
        display: none;
    }
    height: 100%;
    left: 70%;
    opacity: 20%;
    background-color:lightgreen;
`

export const LogoutModal = styled.div`
    display: flex;
    position: absolute;
    z-index: 2000; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */

`
export const LogoutModalContent = styled.div`
    background-color: #f3faf4;
    margin: auto;
    /* padding: 20px; */
    border: 1px solid #888;
    width: 90%;
    height: 30%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    z-index: 2000;
`

export const Page = styled.div`
    margin-left: none;
    padding-bottom: 15%;
    ${bp.tablet} {
        margin-left: 15%;
        padding-bottom: 10%;
    } 
    /* ${bp.desktop} {
        padding-bottom: 5%;
        margin-left: 15%;
    }    */

`
export const InitialGap = styled.div`
    padding-top: 4rem;
` 




