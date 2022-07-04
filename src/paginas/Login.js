import React from 'react';
import FormLogin from '../componentes/FormLogin';
import { Col, Row } from 'antd';
import '../estilos.css';
import LogoPiki from '../img/logopiki.png';

function Login() {
  return (
      <Row className="login">
          <Col xs={1} sm={2} md={5} lg={3}></Col>
          <Col xs={20} sm={12} md={6} lg={7}>
            <img className='imagen-login' src={LogoPiki} alt='logopiki'/> 
          </Col>
          <Col xs={22} sm={10} md={10} lg={9}>
            <FormLogin/>
          </Col>
          <Col xs={1} sm={2} md={5} lg={3}></Col> 
      </Row>
     
  )
}

export default Login