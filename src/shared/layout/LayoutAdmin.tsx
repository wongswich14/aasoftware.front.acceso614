import { useState } from 'react';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { FaBars } from 'react-icons/fa';



const LayoutAdmin = () => {

    const [mostrar, setMostar] = useState(true)

    return (
        <>
            {
                mostrar ?
                    <Sidebar />
                    :
                    ''
            }

            <section className={`flex flex-col h-screen w-full ` + (mostrar ? "md:pl-60" : "")}>
                <Header mostrar={mostrar}>
                    <button className='w-10 justify-self-start h-10 hover:cursor-pointer' onClick={() => (mostrar ? setMostar(false) : setMostar(true))}>
                        <FaBars className='fa-xl text-gray-800' />
                    </button>
                </Header>
                <div className='flex-grow  bg-slate-100 p-5'>
                    <Outlet />
                </div>
                <Footer />
            </section>
        </>
    )
}

export default LayoutAdmin