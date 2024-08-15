import { FaChevronRight } from "react-icons/fa";
import { AiFillDashboard } from "react-icons/ai";
import { FaCog, FaUsers } from "react-icons/fa";
import { Link } from 'react-router-dom';
import logo2 from '@assets/img/logo-aasoftware.png';
import React, { ComponentType, ReactNode, useState } from "react";
import Divider from "../components/Divider";
import { MdHome, MdLocationCity } from "react-icons/md";
import { FaUserShield } from "react-icons/fa";

type MenuItem = {
    name: string;
    link?: string;
    icon: ComponentType<{ size: string }>;
    hasChild: boolean;
    childrens?: SubMenuItem[];
};

type SubMenuItem = {
    name: string;
    link: string;
    icon: ComponentType<{ size: string }>;
};

type SidebarProps = {
    children?: ReactNode;
};

type SubmenuProps = {
    menu: MenuItem;
    index: number;
};

const Sidebar: React.FC<SidebarProps> = () => {

    const [open] = useState(true)
    
    const menus  = [
        { name: 'Dashboard', link: '/', icon: AiFillDashboard, hasChild: false },
        {
            name: 'Administración', icon: FaCog, hasChild: true,
            childrens: [
                // { name: 'Residenciales', link: '/residentials', icon: MdLocationCity },
                // { name: 'Viviendas', link: '/houses', icon: MdHome },
                { name: 'Usuarios', link: '/users', icon: FaUsers },
                { name: "Perfiles", link: '/profiles', icon: FaUserShield }
            ]
        },
        // {
        //     name: 'REPSE', icon: FaShuttleVan, hasChild: true,
        //     childrens: [
        //         { name: 'Provedores', link: '/provider', icon: FaTasks },
        //         { name: 'Documentos', link: '/provider/documentation', icon: GrDocumentText },

        //     ]
        // },
    ];

    return (
        <section className='flex h-screen z-30 fixed gap-6'>
            <div className={`${open ? ' w-60' : 'w-16'} bg-[#0e0e0e] min-h-screen duration-500 text-gray-100 px-4 `}>
                <div className='flex flex-col justify-between h-full'>
                    <div className=''>
                        <div className='flex justify-center p-5 mb-10'>
                            <img src={logo2} className='' />
                        </div>
                        <h2>Acceso 614</h2>
                        <Divider />
                        <div className='mt-4 flex flex-col gap-4 relative '>
                            <ul>
                                {menus.map((menu, i) => (
                                    menu.hasChild
                                        ? <Submenu menu={menu} index={i} key={`sm-${i}`} />
                                        : <li key={i}>
                                            <Link
                                                key={`link-${i}`}
                                                to={menu.link!}
                                                className='flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md'
                                            >
                                                <div>{React.createElement(menu.icon, { size: '20' })}</div>
                                                <h2
                                                    style={{
                                                        transitionDelay: `${i + 3}00ms`
                                                    }}
                                                    className={''}
                                                >{menu.name}</h2>
                                            </Link>
                                        </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default Sidebar

const Submenu: React.FC<SubmenuProps> = ({ menu, index }) => {

    const [subMenuOpen, setSubMenuOpen] = useState(false);

    return (
        <div className='' key={index}>
            <button
                onClick={() => { setSubMenuOpen(!subMenuOpen); }}
                className='flex items-center text-sm gap-3.5 font-medium p-2 w-full rounded-md '>
                <div>{React.createElement(menu.icon, { size: '20' })}</div>
                <h2 className={``}>{menu.name}</h2>
                <FaChevronRight className={`${subMenuOpen && 'rotate-90 transition-all'} duration-500 h-4 w-4 absolute right-1`} />
            </button>
            <div className={`flex-col ml-10 ${!subMenuOpen && 'hidden'} transition-all duration-500`}>
                {menu.childrens?.map((child, j) => (
                    <Link
                        key={j}
                        to={child.link}
                        className='flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md '>
                        <div>{React.createElement(child.icon, { size: '20' })}</div>
                        <h2>{child.name}</h2>
                    </Link>
                ))}
            </div>
        </div>
    )
}