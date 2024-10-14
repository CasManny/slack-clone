"use client"
import React, { useState } from 'react'
import { SignInFlow } from '../types'
import SignInCard from './sign-in-card'
import SignUpCard from './sign-up-card'

const AuthScreen = () => {
    const [state, setstate] = useState<SignInFlow>('signIn')
  return (
      <div className='h-[100vh] flex items-center justify-center bg-[#5C3B58]'>
          <div className="md:h-auto md:w-[420px]">
              {state === 'signIn' ? <SignInCard setState={setstate} /> : <SignUpCard setState={setstate} />}
          </div>
    </div>
  )
    
}

export default AuthScreen