import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {SidebarData} from './datosmenu';
import SubMenu from './submenu';



const SidebarNav = styled.nav`
  width: 200px;
  margin-top: 15px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  color: #fff;
  top: 0;
`;

const SidebarWrap = styled.div`
  width: 100%;
  color: #fff;
`;

function menu() {
  return (
    <>
      <SidebarNav>
        <SidebarWrap>
        {SidebarData.map((item, index) =>{
                return  <SubMenu item={item} key={index} />;
            })}
        </SidebarWrap>
      </SidebarNav>
    </>
  )
}

export default menu