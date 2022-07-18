import React from 'react'
import '../estilos.css';
import Cookies from "universal-cookie";
import { Layout } from 'antd';
//
import Menu from '../componentes/menu';
import CustomGrid from '../componentes/Grid/MENU/grid';
import PmGrid from '../componentes/Grid/PXM/grid2';

import {
  Routes,
  Route,
} from "react-router-dom";
import GridModulo from '../componentes/Grid/MODULO/gridModulo';




const { Header, Sider, Content } = Layout;

const arrayCookie = new Cookies();

const menus = arrayCookie.get('menu');
console.log(menus);

export default function Inicio() {
  return (
    <>
      <Layout>
      <Sider className="menu">
        <Menu/>
      </Sider>
      <Layout>
        <Header className="cabecera">
         <div className='colorcabecera'>
          <h2 style={{color: 'white'}}>Demo de Grids en React</h2>  
         </div>
        </Header>
          <Content>
          <Routes>
          <Route path="eje1"  element={<GridModulo />} />
          <Route path="eje2"  element={<PmGrid />} />
          </Routes>
          </Content> 
      </Layout>
    </Layout>
    </>
  )
}
