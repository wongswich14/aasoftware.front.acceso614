import React, { useState } from 'react'
import yo from "@assets/img/yo.jpeg"
import { FaChevronDown, FaSignOutAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectUserData } from 'src/core/slices/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { serverApi } from 'src/core/serverApi'

type HeaderProps = {
    mostrar: boolean,
    children?: React.ReactNode
}

const Header: React.FC<HeaderProps> = ({ mostrar, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const userData = useSelector(selectUserData)
    const size = window.innerWidth
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(logout())
        dispatch(serverApi.util.resetApiState())
        localStorage.clear()
        navigate('/login')
    }

    return (
        <div className={'md :h-[10vh] flex bg-white items-center h-16 shadow-md p-8 border-b border-gray-200' + (mostrar ? " md:justify-between justify-end" : " justify-between")}>


            {children}


            {
                ((mostrar) && (size <= 640)) ? '' :

                    <div className='flex items-center cursor-pointer'
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <img src={yo} className='rounded-full border border-gray-200 h-10 w-10' />
                        <div className='flex-col ml-1 '>
                            <h2 className='borde text-sm text-gray-500 font-semibold'>{ `${userData?.name} ${userData?.lastName}` }</h2>
                            <h2 className='borde text-sm text-white font-semibold bg-cyan-500 rounded-full text-center'>Developer</h2>
                        </div>
                        <FaChevronDown className={`ml-2.5`} />
                        {isOpen && (
                            <div className={`duration-700 border border-gray-200 absolute bg-white w-40 p-3 rounded-md text-gray-500 mt-36`}>
                                <button
                                    type='button'
                                    onClick={handleLogout}
                                    className='flex justify-left items-center gap-4 h-full w-full'
                                >
                                    <FaSignOutAlt className='' />
                                    Salir
                                </button>
                            </div>
                        )}
                    </div>
            }




        </div >
    )
}

export default Header