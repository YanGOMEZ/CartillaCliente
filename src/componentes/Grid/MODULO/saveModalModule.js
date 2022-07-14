/* saveModalModule, su función es desplegar un modal para crear un nuevo modulo */

/* Includes o Imports */
import { Modal, Button } from 'antd';
import React from 'react';
import image from '../../../img/plus.jpeg'
import '../../../menuProp.css'
import FormModule from './formSaveModule';

class SaveModalModule extends React.Component {


  /* Vista */
  render() {
    const { visible } = this.state;
    return (
      <>
        <a onClick={this.showModal}>
        <img src={image} width={50} style={{float:'left'}} alt=""/>
        </a>
        <h1 className='user-type' style={{marginLeft:60}}>Modulos</h1>
        <Modal
          visible={visible}
          title="Nuevo menu"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Regresar
            </Button>
          ]}
        >

          <FormModule/>

        </Modal>
      </>
    );
  }

  /* Funciones */
  state = {
    loading: false,
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

}

export default SaveModalModule;