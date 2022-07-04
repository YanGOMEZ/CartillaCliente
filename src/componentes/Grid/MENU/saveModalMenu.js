import { Modal, Button } from 'antd';
import React from 'react';

import image from '../../../img/plus.jpeg'
import '../../../menuProp.css'
import FormMenu from './formSaveMenu';

class SaveModalMenu extends React.Component {
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

  render() {
    const { visible } = this.state;
    return (
      <>
        <a onClick={this.showModal}>
        <img src={image} width={50} style={{float:'left'}} alt=""/>
        </a>
        <h1 className='user-type' style={{marginLeft:60}}>Menús</h1>
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

            <FormMenu/>

        </Modal>
      </>
    );
  }
}

export default SaveModalMenu;