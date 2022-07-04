import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as GiIcons from 'react-icons/gi';
import * as BsIcons from 'react-icons/bs';


export const SidebarData = [
    {
        titulo: 'Grids de Prueba',
        path: '/mascotas',
        icon: <BsIcons.BsGrid3X3/>,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        subProgramas:[
            {
                titulo: 'Grid Menu',
                path: '/inicio/eje1',
                icon: <IoIcons.IoIosPaper />
            },
            {
                titulo: 'Grid PXM',
                path: '/inicio/eje2',
                icon: <IoIcons.IoIosPaper />
            }
        ]
     }
    // {
    //     titulo: 'Favoritos',
    //     path: '/favoritos',
    //     icon: <AiIcons.AiFillStar/>,
    //     iconClosed: <RiIcons.RiArrowDownSFill />,
    //     iconOpened: <RiIcons.RiArrowUpSFill />,
    //     subProgramas:[
    //         {
    //             titulo: 'Citas',
    //             path: '/favoritos/citas',
    //             icon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             titulo: 'Perfil',
    //             path: '/favoritos/perfil',
    //             icon: <IoIcons.IoIosPaper />
    //         }
    //     ]
    // },
    // {
    //     titulo: 'Menus',
    //     path: '/menus',
    //     icon: <MdIcons.MdMenuBook/>,
    //     iconClosed: <RiIcons.RiArrowDownSFill />,
    //     iconOpened: <RiIcons.RiArrowUpSFill />,
    //     subProgramas:[
    //         {
    //             titulo: 'Tipo Usuario',
    //             path: '/menus/tipou',
    //             icon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             titulo: 'Programas',
    //             path: '/menus/programas',
    //             icon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             titulo: 'Programas por Menu',
    //             path: '/menus/programasxmen',
    //             icon: <IoIcons.IoIosPaper />
    //         }
    //     ]
    // }
]