import { useState } from "react"

interface SwitcherProps {
    id?: string
    isChecked: boolean
    onChange: () => void
}

const Switcher: React.FC<SwitcherProps> = ({ id, isChecked, onChange }) => {
    return (
        <label className='flex cursor-pointer select-none items-center'>
        <div className='relative'>
          <input
            type='checkbox'
            id={id}
            checked={isChecked}
            onChange={onChange}
            className='sr-only'
          />
          <div
            className={`box block h-7 w-12 rounded-full ${isChecked ? 'bg-green-500' : 'bg-gray-200'
              }`}
          ></div>
          <div
            className={`absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white transition duration-500 ${isChecked ? 'translate-x-full' : ''
              }`}
          ></div>
        </div>
      </label>
    )
}

export default Switcher