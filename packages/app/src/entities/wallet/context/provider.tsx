'use client'

import React, { useEffect, useState } from 'react'
import { getUserInfo, isConnected as getIsConnected } from '@stellar/freighter-api'
import { WalletContext } from './context'

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState<boolean | null>(null)

  useEffect(() => {
    ;(async () => {
      const res = await getIsConnected()
      setIsConnected(res)
    })()
  }, [])

  useEffect(() => {
    if (!isConnected) return () => {}
    const getAddress = async () => {
      const userInfo = await getUserInfo()
      setAddress(userInfo.publicKey)
    }
    getAddress()

    const id = setInterval(() => {
      getAddress()
    }, 2000)
    return () => {
      clearInterval(id)
    }
  }, [isConnected])

  return (
    <WalletContext.Provider value={{ address, setAddress, isConnected }}>
      {children}
    </WalletContext.Provider>
  )
}
