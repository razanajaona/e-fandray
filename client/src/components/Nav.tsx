import React from 'react'
import logo from '../assets/icon.png'

export interface Props {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const Nav: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="bg-white fixed w-full top-0 left-0 z-10 flex items-center justify-between shadow-sm py-3 px-6 nav">
      <div className="flex items-center">
        <img src={logo} alt="Chat App" className="h-12 w-12" />
        <h1 className="titre">Ndao iresaka</h1><br />
      </div>
      <button
        type="button"
        className="px-6 py-3 text-white font-medium rounded-md shadow-md  disabled:opacity-50 focus:outline-non bouton "
        onClick={onClick}
      >
        hiala
      </button>
    </div>
  )
}
