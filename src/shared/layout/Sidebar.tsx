import {FaChevronRight, FaIdCard} from "react-icons/fa";
import {AiFillDashboard} from "react-icons/ai";
import {FaCog, FaUsers} from "react-icons/fa";
import {Link} from 'react-router-dom';
import logo2 from '@assets/img/logo-aasoftware.png';
import React, {ComponentType, ReactNode, useState} from "react";
import Divider from "../components/Divider";
import {MdHome, MdLocationCity} from "react-icons/md";
import {FaUserShield} from "react-icons/fa";
import {BsDoorOpenFill} from "react-icons/bs";
import {useSelector} from "react-redux";
import {selectUserData} from "../../core/slices/auth/authSlice.ts";
import {extractPermissions} from "../../core/utils/extractPermissions.ts";

type MenuItem = {
    name: string;
    link?: string;
    icon: ComponentType<{ size: string }>;
    hasChild: boolean;
    childrens?: SubMenuItem[];
    permissions?: string[];
};

type SubMenuItem = {
    name: string;
    link: string;
    icon: ComponentType<{ size: string }>;
    permissions?: string[];
};

type SidebarProps = {
    children?: ReactNode;
};

type SubmenuProps = {
    menu: MenuItem;
    index: number;
};

const filterMenusByPermissions = (
    menus: MenuItem[],
    permissionsWithScopes: Record<string, string | null>
): MenuItem[] => {

    // Función para verificar si un permiso tiene acceso
    const hasPermission = (perm: string): boolean => {
        // Si el permiso no existe en el objeto de permisos, se deniega el acceso.
        return permissionsWithScopes[perm] !== undefined;
    };

    // Verificar si el scope del permiso es válido para el menú
    const isScopeValid = (perm: string, expectedScope?: string): boolean => {
        const scope = permissionsWithScopes[perm];
        if (!scope) return false;

        // Si se espera un scope específico, comparamos; de lo contrario, aceptamos cualquier scope
        return expectedScope ? scope === expectedScope : true;
    };

    // Filtramos los menús basados en los permisos
    return menus.reduce((filteredMenus: MenuItem[], menu: MenuItem) => {
        // Verificar permisos y scopes a nivel de menú
        if (!menu.permissions || menu.permissions.some(perm => hasPermission(perm))) {
            const filteredMenu = {...menu};

            // Si tiene hijos, también filtrarlos recursivamente
            if (menu.hasChild && menu.childrens) {
                filteredMenu.childrens = menu.childrens.filter(child =>
                    !child.permissions || child.permissions.some(perm => hasPermission(perm))
                );
            }

            // Si pasa el filtro, agregar al menú filtrado
            if (!menu.hasChild || (filteredMenu.childrens && filteredMenu.childrens.length > 0)) {
                filteredMenus.push(filteredMenu);
            }
        }

        return filteredMenus;
    }, []);
};

const Sidebar: React.FC<SidebarProps> = () => {

    const [open] = useState(true)
    const userData = useSelector(selectUserData);
    const permissions = extractPermissions(userData!.token)
    console.log(permissions)

    const menus = [
        {name: 'Dashboard', link: '/', icon: AiFillDashboard, hasChild: false},
        {
            name: 'Administración', icon: FaCog, hasChild: true, permissions: ["superAccess", "getHouses:global", "getUsers:global", "getProfiles"],
            childrens: [
                {
                    name: 'Residenciales',
                    link: '/residentials',
                    icon: MdLocationCity,
                    permissions: ["getResidentials:global", "superAccess"]
                },
                {name: 'Viviendas', link: '/houses', icon: MdHome, permissions: ["getHouses:global", "superAccess"]},
                {name: 'Usuarios', link: '/users', icon: FaUsers, permissions: ["getUsers:global", "superAccess"]},
                {name: "Perfiles", link: '/profiles', icon: FaUserShield, permissions: ["getProfiles", "superAccess"]},
            ]
        },
        {
            name: "Hogar", link: `/houses/${userData?.homeId}`, icon: MdHome,
            hasChild: false
        }
    ];

    const filteredMenus = filterMenusByPermissions(menus, permissions);

    return (
        <section className='flex h-screen z-30 fixed gap-6'>
            <div className={`${open ? ' w-60' : 'w-16'} bg-[#0e0e0e] min-h-screen duration-500 text-gray-100 px-4 `}>
                <div className='flex flex-col justify-between h-full'>
                    <div className=''>
                        <div className='flex justify-center p-5 mb-10'>
                            <img src={logo2} className=''/>
                        </div>
                        <h2>Acceso 614</h2>
                        <Divider/>
                        <div className='mt-4 flex flex-col gap-4 relative '>
                            <ul>
                                {filteredMenus.map((menu, i) => (
                                    menu.hasChild
                                        ? <Submenu menu={menu} index={i} key={`sm-${i}`}/>
                                        : <li key={i}>
                                            <Link
                                                key={`link-${i}`}
                                                to={menu.link!}
                                                className='flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md'
                                            >
                                                <div>{React.createElement(menu.icon, {size: '20'})}</div>
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
        </section>
    )
}

export default Sidebar

const Submenu: React.FC<SubmenuProps> = ({menu, index}) => {

    const [subMenuOpen, setSubMenuOpen] = useState(false);

    return (
        <div className='' key={index}>
            <button
                onClick={() => {
                    setSubMenuOpen(!subMenuOpen);
                }}
                className='flex items-center text-sm gap-3.5 font-medium p-2 w-full rounded-md '>
                <div>{React.createElement(menu.icon, {size: '20'})}</div>
                <h2 className={``}>{menu.name}</h2>
                <FaChevronRight
                    className={`${subMenuOpen && 'rotate-90 transition-all'} duration-500 h-4 w-4 absolute right-1`}/>
            </button>
            <div className={`flex-col ml-10 ${!subMenuOpen && 'hidden'} transition-all duration-500`}>
                {menu.childrens?.map((child, j) => (
                    <Link
                        key={j}
                        to={child.link}
                        className='flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md '>
                        <div>{React.createElement(child.icon, {size: '20'})}</div>
                        <h2>{child.name}</h2>
                    </Link>
                ))}
            </div>
        </div>
    )
}