import { bp } from '@/lib/breakpoints'
import styled from '@emotion/styled'

export const Input = styled.input`
    font-size: small;
    height: min-content;
    padding: 2px;
    margin: 5px;
    border-radius: 5px;
    color: black;
    border: 1px solid ${props => props.theme.colors.title};
    &:focus {
        outline: none;
        /* font-weight: bold; */
    }
    &::placeholder {
        color: ${props => props.theme.colors.title};
        opacity: 0.8;
    }
`

export const Button = styled.button`
    margin: 5px;
    font-size: medium;
    padding: 5px;
    background-color: ${props => props.theme.colors.contrast};
    color: white;
    border-radius: 5px;
    border-width: 0;
    &:disabled {
        background-color: lightgray;
        
        &:hover {
            background-color: lightgray;
            cursor: default;
        }
    }
    &:hover{
        background-color: #08db60;
        cursor: pointer;
    }
`

export const ButtonOutline = styled.button`
    margin: 5px;
    font-size: small;
    padding: 2px;
    background-color: transparent;
    color: ${props => props.theme.colors.title};
    border-radius: 5px;
    border: 1px solid ${props => props.theme.colors.title};
    &:hover{
        cursor: pointer;
    }
`


export const Select = styled.select`
    font-size: small;
    height: min-content;
    padding: 2px;
    margin: 5px;
    border-radius: 5px;
    /* background-color: ${props => props.theme.colors.background}; */
    color: ${props => props.theme.colors.title};
    border: 1px solid ${props => props.theme.colors.title};
    &:focus {
        outline: none;
    }
`

export const Option = styled.option`
    font-size: medium;
    padding: 5px;
    margin: 5px;
    border-radius: 5px;
    background-color: white;
    color: ${props => props.theme.colors.primary};
    border: 1px solid ${props => props.theme.colors.borderPrimary};
`

export const ToggleNav = styled.a`
    text-align: center;
    border-radius: 5px;
    padding: 2%;
    margin: 0.5%;
    text-decoration: none;
    font-size: 1.5vh;
    color: ${ props => props.active?props.theme.colors.contrast:props.theme.colors.primary};

    /* border-radius: 5px;  */
    background-color: ${props => props.active?props.theme.colors.backgroundActive:props.theme.colors.background};
    &:hover {
        cursor: pointer;
    }
`
