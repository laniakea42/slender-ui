'use client'

import React, { useState } from 'react'
import { SUPPORTED_TOKENS, SupportedToken } from '@/shared/stellar/constants/tokens'
import { BorrowStepModal } from '../borrow-step-modal'
import { CollateralStepModal } from '../collateral-step-modal'
import { Position } from '../../types'

enum Step {
  Borrow = 'Borrow',
  Collateral = 'Collateral',
}

interface Props {
  type: SupportedToken
  onSend: (value: Position) => void
}

const getCollateralsByBorrow = <
  T extends SupportedToken,
  E = Exclude<SupportedToken, T>,
  R = [E, E],
>(
  token: T,
): R => SUPPORTED_TOKENS.filter((element) => element !== token) as R

export function SingleBorrowFlow({ type, onSend }: Props) {
  const [step, setStep] = useState<Step | null>(null)
  const [borrowValue, setBorrowValue] = useState('')

  const handleClose = () => {
    setStep(null)
    setBorrowValue('')
  }

  const handleSend = (value: Position) => {
    handleClose()
    onSend(value)
  }

  const modalByStep = {
    [Step.Borrow]: (
      <BorrowStepModal
        borrowValue={borrowValue}
        onClose={handleClose}
        onContinue={() => setStep(Step.Collateral)}
        onBorrowValueChange={setBorrowValue}
        borrowType={type}
        collateralTypes={getCollateralsByBorrow(type)}
      />
    ),
    [Step.Collateral]: (
      <CollateralStepModal
        onClose={handleClose}
        onPrev={() => setStep(Step.Borrow)}
        borrowValue={borrowValue}
        borrowType={type}
        collateralTypes={getCollateralsByBorrow(type)}
        onSend={handleSend}
      />
    ),
  }

  const handleClick = () => {
    setStep(Step.Borrow)
  }

  return (
    <div style={{ padding: '8px', border: '1px solid gray' }}>
      {!step && (
        <button type="button" onClick={handleClick}>
          {type} Borrow
        </button>
      )}
      {step && modalByStep[step]}
    </div>
  )
}
