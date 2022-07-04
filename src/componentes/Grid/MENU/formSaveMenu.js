import { Form, Input, Button, message, Upload} from 'antd';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import '../../../componentes.css';
import 'antd/dist/antd.min.css';
import { UploadOutlined } from '@ant-design/icons';
import Question from '../../../Question';
import { Autocomplete, TextField } from '@mui/material';

const {Item} = Form;
const urlApi = 'http://127.0.0.1:4444/menu/create'
const urlApic = 'http://127.0.0.1:4444/submenu'
const urlApi2 = 'http://127.0.0.1:4444/menu'

const FormMenu = () => {

    const [fileList, setFileList] = useState([])
    const [data, setData] = useState([])
    const [valid, setValid] = useState("")
    const [img, setImg] = useState("")
    const [clave, setClave] = useState("")
    const [nombre, setNmb] = useState("")
    const [des, setDes] = useState("")
    const [sub, setSub] = useState(null)
    const [datos, setDatos] = useState([])
    const [posicion, setPosicion] = useState(null)

    const body = JSON.stringify({
      "SUM_ETIQUETA": "",
      "ORDER":"",
      "BY":"",
    })

    const traerTabla = async () => {
      axios.post(urlApic, body,{

          "headers": {
          
          "content-type": "application/json",
          
          },
          
          }).then((response) =>
      setData(response.data)
      ).catch(error =>{
          console.log(error);
      })
  }

  const traerTabla2 = async () => {
    axios.post(urlApi2, {MEN_DESC:""},{

        "headers": {
        
        "content-type": "application/json",
        
        },
        
        }).then((response) =>
    setDatos(response.data)
    ).catch(error =>{
        console.log(error);
    })
}

    const beforeUpload = (files) => {
      const isJpgOrPng = files.type === 'image/png';
      const isLt2M = files.size / 1024 / 1024 < 2;
    
      if (!isJpgOrPng) {
        message.error('Solo puedes subir archivos PNG!');
        setValid("NO")
      }
      else{
        setValid("YES")
      }
    
      if (!isLt2M) {
        message.error('La imagen no debe pesar más de 2 MB!');
        setValid("NO")
      }

      return isJpgOrPng && isLt2M;
    };

    const key = 'updatable';
    const onFinish =async (values) => {
        console.log("sub ", sub, " pos ", posicion);
        if(valid == "YES"){
          await axios.post(urlApi,{MEN_CLAVE:clave, MEN_NOMBRE:nombre, MEN_ICON:img, MEN_DESC:des, MEN_ORDEN: posicion, SUM_NUMCTRL:sub}).then((response)=>{
            console.log(response.data);
            message.loading({ content: 'Ingresando Datos...',duration: 2, key,style: {
            marginTop: '18vh',
            }, });
            setTimeout(() => {
            message.success({ content: 'Datos Registrados', key, duration: 2, style: {
                marginTop: '18vh',
            }, });
            }, 1000);
            window.setTimeout(function() {
            window.location.reload();
        }, 4000);
        }).catch(errorInfo =>{
            console.log(errorInfo);
            message.loading({ content: 'Verificando...', key,style: {
            marginTop: '18vh',
            }, });
            setTimeout(() => {
            message.error({ content: 'Por favor verifica que los datos se han llenado de manera correcta!', key, duration: 4, style: {
                marginTop: '18vh',
            }, });
            }, 1000);
        })
      }
      else{
        await axios.post(urlApi,{MEN_CLAVE:clave, MEN_NOMBRE:nombre, MEN_ICON:Question, MEN_DESC:des, MEN_ORDEN: posicion, SUM_NUMCTRL:sub}).then((response)=>{
          console.log(response.data);
          message.loading({ content: 'Ingresando Datos...',duration: 2, key,style: {
          marginTop: '18vh',
          }, });
          setTimeout(() => {
          message.success({ content: 'Datos Registrados', key, duration: 2, style: {
              marginTop: '18vh',
          }, });
          }, 1000);
          window.setTimeout(function() {
          window.location.reload();
      }, 4000);
      }).catch(errorInfo =>{
          console.log(errorInfo);
          message.loading({ content: 'Verificando...', key,style: {
          marginTop: '18vh',
          }, });
          setTimeout(() => {
          message.error({ content: 'Por favor verifica que los datos se han llenado de manera correcta!', key, duration: 4, style: {
              marginTop: '18vh',
          }, });
          }, 1000);
      })
      }
    };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleChange = ({fileList: newFileList}) => {
    if(valid == "NO"){
    }
    else{
      if (newFileList.status !== "uploading") {
        setFileList(newFileList);
      }
    }
  };

  const onPreview = async (file) => {
    const dato = new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () =>resolve(reader.result);
  })

  const str = await dato

  setImg(str)
}

const Auto = (value) =>{
  setSub(value.valor)
  var cantidad = 1
  for (let index = 0; index < datos.length; index++) {
    if(datos[index].SUM_NUMCTRL == value.valor){
      cantidad = cantidad+1
    }
  }
  setPosicion(cantidad)
}

  useEffect(()=>{
    traerTabla()
    traerTabla2()
    console.log(fileList)
    console.log(img.length)
  },[fileList, img, posicion, sub])

  const existentes =()=>{
    for (let index = 0; index < data.length; index++) {
      const element = {label:data[index].SUM_ETIQUETA, valor:data[index].SUM_NUMCTRL}
      exist.push(element)
    }
  }

  const exist = []

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
        name="MEN_CLAVE"
        rules={[
          {
            required: true,
            message: 'Inserta una clave!',
          },
        ]}
      >
        <Input onChange={(x)=>setClave(x.target.value)} />
      </Form.Item>

      <Form.Item
        label="Nombre"
        name="MEN_NOMBRE"
        rules={[
          {
            required: true,
            message: 'Inserta un nombre!',
          },
        ]}
      >
        <Input onChange={(x)=>setNmb(x.target.value)}/>
      </Form.Item>

      <Form.Item
        label="Descripción"
        name="MEN_DESC"
        rules={[
          {
            required: true,
            message: 'Inserta una descripción!',
          },
        ]}
      >
        <Input onChange={(x)=>setDes(x.target.value)}/>
      </Form.Item>

      <Form.Item wrapperCol={{
          span: 4,
          offset:6,
        }}
        name="SUM_NUMCTRL"
        rules={[
          {
            required: true,
            message: 'Inserta un submenú!',
          },
        ]}
      >
        <Autocomplete onClick={existentes()} onChange={(evemt, value)=>Auto(value)}
        disablePortal
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option)=> option.valor}
        id="combo-box-demo"
        options={exist}
        sx={{ width: 315}}
        renderInput={(params) => <TextField {...params} label="Submenú" />}
        />
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
      <Upload beforeUpload={(x)=>{
        onPreview(x)
        beforeUpload(x)
        return false}}
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

export default FormMenu;