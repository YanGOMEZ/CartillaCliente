import { Button, Form, Input, message } from 'antd';
import React from 'react';
import 'antd/dist/antd.min.css';
import axios from "axios";
import Cookies from "universal-cookie";
import '../estilos.css';


const urlApi = process.env.REACT_APP_URL_SERVER + '/usuario/login'
const key = 'updatable';
const arrayCookie = new Cookies();

const App = () => {

  //Metodo de logeo
  const onFinish = async (values) => {
    await axios.post(urlApi, values, {

      "headers": {

        "content-type": "application/json",

      },

    }).then((response) => {
      console.log(response.data);
      arrayCookie.set('menu', response.data.menus, { path: '/inicio' })
      message.loading({
        content: 'Verificando...', key, style: {
          marginTop: '18vh',
        },
      });
      setTimeout(() => {
        message.success({
          content: 'Bienvenido a la Plataforma', key, duration: 2, style: {
            marginTop: '18vh',
          },
        });
      }, 1000);
      window.setTimeout(function () {
        window.location.href = './inicio';
      }, 3000);
    }).catch(errorInfo => {
      console.log(errorInfo);
      message.loading({
        content: 'Verificando...', key, style: {
          marginTop: '18vh',
        },
      });
      setTimeout(() => {
        message.error({
          content: 'Nombre de Usuario o contraseña incorrectos!', key, duration: 4, style: {
            marginTop: '18vh',
          },
        });
      }, 1000);
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };



  return (
    <Form
      name="basic"

      wrapperCol={{
        offset: 1,
        span: 24,
      }}

      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
      >


        <h2 className="titulo-login">Bienvenido</h2>

      </Form.Item>
      <Form.Item

        name="correo"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input placeholder="Username" />
      </Form.Item>

      <Form.Item

        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>



      <Form.Item

      >
        <Button type="primary" htmlType="submit" shape="round" block>
          Iniciar Sesion
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;