import styled from '@emotion/styled'

// new 
export const PrimaryHeading1 = styled.h1`
    color: ${props => props.theme.colors.primary};
`

export const PrimaryHeading3 = styled.h3`
    color: ${props => props.theme.colors.primary};
`

export const ComparisonText = styled.p`
    /* font-weight: bold; */
    font-size: 12px;
    color: ${props => props.inc?"#258965":"#AC1616"};
`

export const SectionHeading = styled.h2`
    font-weight: normal;
`

export const Caption = styled.p`
    font-size: 16px;
    color: ${props => props.theme.colors.title};
`

// old 
export const H2 = styled.h2`
    color: ${props => props.theme.colors.title};
`
export const H3 = styled.h3`
    color: ${props => props.theme.colors.title};
`;

export const Sub = styled.p`
    color: ${props => props.theme.colors.title};
    font-size: 14px;
`;

export const P1 = styled.p`
    white-space: nowrap;
    color: ${props => props.theme.colors.primary};
    margin:5px; 
`

export const H4 = styled.h2`
    color: ${props => props.theme.colors.primary};
    margin:5px; 
`