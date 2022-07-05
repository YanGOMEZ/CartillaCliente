import { Form, Input, Modal, Button, message } from 'antd';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import '../../../componentes.css';
import 'antd/dist/antd.min.css';
import userEvent from '@testing-library/user-event';
import { styled } from "@mui/material/styles";
import image from '../../../img/plus.jpeg';
import '../../../menuProp.css'

const CustomDisableInput = styled(TextField)(() => ({
  ".MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "#000",
    color: "#000"
  }
}));

const { Item } = Form;
const urlApi = process.env.REACT_APP_URL_SERVER + '/proxmen/create'
const urlApi2 = process.env.REACT_APP_URL_SERVER + '/programa'

function FormPXM(props) {
  const [prg, setprg] = useState(null)
  const [mens, setmens] = useState(null)
  const key = 'updatable';
  const [data, setData] = useState([])
  const [orden, setOrden] = useState(props.op)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [input, setInput] = useState("")

  const traerTabla = async () => {
    axios.post(urlApi2, { PRG_NUMCTRL: "", PRG_CLAVE: "", PRG_NOMBRE: "", PRG_RUTA: "", PRG_DESC: "", ORDER: "", BY: "", LIMIT1: 0, LIMIT2: 9999 }, {

      "headers": {

        "content-type": "application/json",

      },

    }).then((response) =>
      setData(response.data)
    ).catch(error => {
      console.log(error);
    })
  }

  const onFinish = async () => {
    await axios.post(urlApi, { PRG_NUMCTRL: prg, MEN_NUMCTRL: mens, PXM_ORDEN: orden }).then((response) => {
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
  };

  const handleChange = (text) => {
    setprg(text.valor)
    setmens(props.valor)
    setOrden(props.op)
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    traerTabla()
  }, [])

  const existentes = () => {
    for (let index = 0; index < props.tb.length; index++) {
      const element = { label: props.tb[index].PRG_NOMBRE, valor: props.tb[index].PRG_NUMCTRL, code: props.tb[index].PRG_CLAVE }
      exist.push(element)
    }
  }

  const formatear = () => {
    existentes()
    for (let index = 0; index < data.length; index++) {
      const element = { label: data[index].PRG_NOMBRE, valor: data[index].PRG_NUMCTRL, code: data[index].PRG_CLAVE }
      top100Films.push(element)
    }
    for (let inde = 0; inde < top100Films.length; inde++) {
      var bandera = 0;
      for (let index = 0; index < exist.length; index++) {
        if (top100Films[inde].valor == exist[index].valor) {
          bandera = 1
          break
        }
        else {
          bandera = 0;
        }
      }
      if (bandera == 0) {
        lista.push(top100Films[inde])
      }
    }
  }

  const top100Films = []
  const exist = []
  const lista = []

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const someMethod = () => {
    props.padre(1)
  }

  const guardar = () => {
    if (prg.length != 0) {
      handleCancel()
      someMethod()
    }
  }

  return (
    <div>
      <a onClick={showModal}>
        <img src={image} width={30} style={{ float: 'left' }} alt="" />
      </a>
      <Modal okButtonProps={{ style: { display: 'none' } }} title="Agregar programa a menú" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form
          name="login"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: false,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item wrapperCol={{
            span: 4,
            offset: 4,
          }}
            name="PRG_NUMCTRL"
            rules={[
              {
                required: true,
                message: 'Inserta un programa!',
              },
            ]}
          >
            {/*         <Input onChange={(x)=>handleChange(x.target.value)}/> */}
            <Autocomplete onClick={formatear()} onChange={(evemt, value) => handleChange(value)}
              disablePortal
              getOptionLabel={(option) => option.label + " - " + option.code}
              isOptionEqualToValue={(option) => option.valor}
              id="combo-box-demo"
              options={lista}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Programa" />}
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 4,
              offset: 4,
            }}
            name="PXM_ORDEN"
          >
            <TextField hidden={true} sx={{ width: 300 }} InputProps={{ disableUnderline: true }} label={"Orden: " + props.op} />

            <CustomDisableInput sx={{ width: 300 }}
              variant="outlined"
              value={props.op}
              label="Orden"
              disabled={true}
            />

          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 4,
              span: 4,
            }}
          >
            <Button type="primary" onClick={guardar} htmlType="submit">
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FormPXM;