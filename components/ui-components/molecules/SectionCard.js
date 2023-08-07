import React from 'react'
import { CardContainer, FlexColCenter, FlexRowCenter } from '../atoms/container'
import Image from 'next/image'
import { H4, P1 } from '../atoms/text'
import equalizer from '../../../public/equalizer.png';

const SectionCard = ({title, loading, value}) => {
  return (
    <CardContainer>
        <FlexRowCenter>
          <Image src={equalizer} height={50} width={50} />
        </FlexRowCenter>
        <FlexColCenter>
          <P1>{title}</P1>
          <H4>{loading?'loading':value}</H4>
        </FlexColCenter>
    </CardContainer>
  )
}

export default SectionCard