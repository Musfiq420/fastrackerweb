/** @jsxImportSource @emotion/react */
import { bp } from '@/lib/breakpoints'
import { css, jsx, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

const scrollNews = keyframes`
    0% {
    transform: translate3d(0, 0, 0);
    }
    100% {
    transform: translate3d(-100%, 0, 0);
    }
`

const NewsBarContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 4000;
    /* height: 20px; */
    width: 100%;
    display: flex;
    flex-direction: row;
    flex:1;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    background-color: #4CAF50;
    /* padding: 5px; */
    color: white;
`


const NewsBarWrapper = styled.div`
    width: 100%;
    background-color: transparent;
`

const NewsName = styled.div`
    white-space: nowrap;
    z-index: 5000;
    background-color: gray;
    padding: 10px;

    display: none;
    ${bp.tablet} {
        display: block;
    }
    ${bp.desktop} {
        display: block;
    }
`

const NewsBarTransition = styled.div`
    display: inline-block;
    white-space: nowrap;
    padding-left: 100%;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-name: ${scrollNews};
    animation-duration: ${props => props.duration}s;
    &:hover {
    animation-play-state: paused;
  }
`


const NewsBar = ({title, content, onIteration, duration}) => {

  return (
    <NewsBarContainer>
      <NewsName>Square News</NewsName>
      <NewsBarWrapper>
      
        <NewsBarTransition
        duration={duration}
        onAnimationIteration={onIteration}
        >
          
          <strong css={css`
            background-color: #E8F5E9;
            color: green;
            padding: 10px;
            font-size: 20px;
          `}>{title}</strong>
          <span css={css`
            font-size: 16px;
            padding-left: 10px;
          `}>
            {content}
          </span>
        </NewsBarTransition>
      </NewsBarWrapper>
    </NewsBarContainer>
  )
}

export default NewsBar