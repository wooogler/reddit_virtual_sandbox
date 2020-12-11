import React from 'react'
import styled from 'styled-components'
import Overlay from './Overlay'
import Spinner from 'react-spinkit';

interface OverlayLoadingProps {
  text: string;
}

function OverlayLoading({text}: OverlayLoadingProps) {
  return (
    <CustomOverlay>
      <TextDiv>{text}</TextDiv>
      <Spinner name="line-spin-fade-loader" />
    </CustomOverlay>
  )
}

const TextDiv = styled.div`
  font-size: 2rem;
  margin-bottom: 3rem;
`

const CustomOverlay = styled(Overlay)`
  
`

export default OverlayLoading
