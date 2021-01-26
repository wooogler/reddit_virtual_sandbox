import React from 'react'
import styled from 'styled-components'

interface AuthLayoutProps {
  children: React.ReactNode
}

function AuthLayout({children}: AuthLayoutProps) {
  return (
    <AuthLayoutDiv>
      {children}
    </AuthLayoutDiv>
  )
}

const AuthLayoutDiv = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background: black;
`

export default AuthLayout
