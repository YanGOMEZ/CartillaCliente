/* formModule, Muestra un formulario para crear un nuevo módulo */

/* Includes o Imports */
import { Form, Input, Button, message, Upload } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import '../../../componentes.css';
import Question from '../../../Question';
import { Autocomplete, TextField } from '@mui/material';

/* Variables Generales */
const { Item } = Form;
const urlApi = process.env.REACT_APP_URL_SERVER + '/modulo/create'

const FormModule = () => {

/*   Variables locales */
  const [fileList, setFileList] = useState([])
  const [valid, setValid] = useState("")
  const [img, setImg] = useState("")
  const [clave, setClave] = useState("")
  const [nombre, setNmb] = useState("")
  const [des, setDes] = useState("")

  /* Funciones */
  const beforeUpload = (files) => {
    const isJpgOrPng = files.type === 'image/png';
    const isLt2M = files.size / 1024 / 1024 < 2;

    if (!isJpgOrPng) {
      message.error('Solo puedes subir archivos PNG!');
      setValid("NO")
    }
    else {
      setValid("YES")
    }

    if (!isLt2M) {
      message.error('La imagen no debe pesar más de 2 MB!');
      setValid("NO")
    }

    return isJpgOrPng && isLt2M;
  };

  const key = 'updatable';
  const onFinish = async (values) => {
    if (valid == "YES") {
      await axios.post(urlApi, { MOD_CLAVE: clave, MOD_NOMBRE: nombre, MOD_ICONO: img, MOD_DESC: des}).then((response) => {
        console.log(response.data);
        message.loading({
          content: 'Ingresando Datos...', duration: 2, key, style: {
            marginTop: '18vh',
          },
        });
        setTimeout(() => {
          message.success({
            content: 'Datos Registrados', key, duration: 2, style: {
              marginTop: '18vh',
            },
          });
        }, 1000);
        window.setTimeout(function () {
          window.location.reload();
        }, 4000);
      }).catch(errorInfo => {
        console.log(errorInfo);
        message.loading({
          content: 'Verificando...', key, style: {
            marginTop: '18vh',
          },
        });
        setTimeout(() => {
          message.error({
            content: 'Por favor verifica que los datos se han llenado de manera correcta!', key, duration: 4, style: {
              marginTop: '18vh',
            },
          });
        }, 1000);
      })
    }
    else {
      await axios.post(urlApi, { MOD_CLAVE: clave, MOD_NOMBRE: nombre, MOD_ICONO: Question, MOD_DESC: des }).then((response) => {
        console.log(response.data);
        message.loading({
          content: 'Ingresando Datos...', duration: 2, key, style: {
            marginTop: '18vh',
          },
        });
        setTimeout(() => {
          message.success({
            content: 'Datos Registrados', key, duration: 2, style: {
              marginTop: '18vh',
            },
          });
        }, 1000);
        window.setTimeout(function () {
          window.location.reload();
        }, 4000);
      }).catch(errorInfo => {
        console.log(errorInfo);
        message.loading({
          content: 'Verificando...', key, style: {
            marginTop: '18vh',
          },
        });
        setTimeout(() => {
          message.error({
            content: 'Por favor verifica que los datos se han llenado de manera correcta!', key, duration: 4, style: {
              marginTop: '18vh',
            },
          });
        }, 1000);
      })
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleChange = ({ fileList: newFileList }) => {
    if (valid == "NO") {
    }
    else {
      if (newFileList.status !== "uploading") {
        setFileList(newFileList);
      }
    }
  };

  const onPreview = async (file) => {
    const dato = new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);
    })

    const str = await dato

    setImg(str)
  }

  useEffect(() => {
    console.log(fileList)
    console.log(img.length)
  }, [fileList, img])

  /* Vista */
  return (
    <div>
      <Form
        name="login"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >

        <Form.Item
          label="Clave"
          name="MOD_CLAVE"
          rules={[
            {
              required: true,
              message: 'Inserta una clave!',
            },
          ]}
        >
          <Input onChange={(x) => setClave(x.target.value)} />
        </Form.Item>

        <Form.Item
          label="Nombre"
          name="MOD_NOMBRE"
          rules={[
            {
              required: true,
              message: 'Inserta un nombre!',
            },
          ]}
        >
          <Input onChange={(x) => setNmb(x.target.value)} />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="MOD_DESC"
          rules={[
            {
              required: true,
              message: 'Inserta una descripción!',
            },
          ]}
        >
          <Input onChange={(x) => setDes(x.target.value)} />
        </Form.Item>

        <Form.Item
          label="Icono"
          name="icon"
          rules={[
            {
              required: false,
              message: 'Inserta un icono!',
            },
          ]}
        >
          <Upload beforeUpload={(x) => {
            onPreview(x)
            beforeUpload(x)
            return false
          }}
            accept='.png'
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
          >
            {fileList.length < 1 && '+ Subir'}
          </Upload>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 6,
            span: 6,
          }}
        >
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormModule;