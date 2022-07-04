import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarLink = styled.p`
  display: flex;
  color: #fff;
  color: #fff;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  list-style: none;
  height: 40px;
  font-weight: bold;
  text-decoration: none;
  font-size: 16px;
`;

const SidebarLabel = styled.span`
  margin-left: 14px;
  margin-top: -10px;
`;

const DropdownLink = styled(Link)`
  background: #001529;
  height: 40px;
  padding-left: 2em;
  display: flex;
  color: #fff;
  align-items: center;
  text-decoration: none;
  font-style: italic;
  color: #fff;
  font-size: 14px;
  &:hover {
    background: rgb(57, 87, 218);
    cursor: pointer;
  }
`;

const SubMenu = ({item}) => {

    const [subnav, setSubnav] = useState(true);

    const showSubnav = () => setSubnav(subnav = true);
    return (
        <>
        <SidebarLink to={item.path}  onClick={item.subProgramas && showSubnav}>
            <div>
                {item.icon}
                <SidebarLabel>{item.titulo}</SidebarLabel>
            </div>
            <div>
                {/* {item.subProgramas && subnav ? item.iconOpened : item.
                subProgramas ? item.iconClosed : null} */}
            </div>
        </SidebarLink>
        {subnav &&
        item.subProgramas.map((item, index) => {
          return (
            <DropdownLink to={item.path} key={index}>
              <SidebarLabel>{item.titulo}</SidebarLabel>
            </DropdownLink>
          );
        })}
        </>
    )
}

export default SubMenu;