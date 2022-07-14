/* gridModulo, despliega un grid que puede manipular la información de los modulos */

/* Includes o Imports */
import { Button, Col, Input, Modal, Row, Table, Dropdown, Menu, Checkbox, message, Upload, Space } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import '../../../componentes.css';
import ReactDragListView from "react-drag-listview";
import { UnorderedListOutlined } from '@ant-design/icons';
import { Autocomplete, TextField } from "@mui/material";
//PDF
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import jsPDF from 'jspdf'
import { SearchOutlined } from "@mui/icons-material";
import Highlighter from "react-highlight-words";
import SaveModalModule from "./saveModalModule";

/* Variables generales */
const urlApi = process.env.REACT_APP_URL_SERVER + '/modulo';

function GridModulo() {
    /* Variables locales */
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [data, setData] = useState([])
    const [edit, setEdit] = useState(false);
    const [editMenu, setEditMenu] = useState(null);
    const [nombre, setNombre] = useState("")
    const [BY, setBY] = useState("ASC")
    const [deleteMany, setDeleteMany] = useState(true)
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [fileList, setFileList] = useState([])
    const [valid, setValid] = useState("")
    const [img, setImg] = useState("")
    const [archPdf, setArchPDF] = useState(null);
    const [modal, setModal] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null)



    /* Funciones */
    useEffect(() => {
        traerTabla()
    }, [nombre, BY, fileList, img])

    const traerTabla = async () => {
        axios.post(urlApi, {}, {

            "headers": {

                "content-type": "application/json",

            },

        }).then((response) => {
            setData(response.data)
        }
        ).catch(error => {
            console.log(error);
        })
        generatePDF()
    }
    const onDelete = (record) => {
        console.log(record)
        Modal.confirm({
            title: 'Estás seguro que deseas eliminar este registro?',
            okText: 'Confirmar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: () => {
                axios.delete(urlApi + "/" + record.MOD_NUMCTRL).then((response) => {
                    traerTabla()
                })
            }
        })
    }

    const deleteManySelected = () => {
        Modal.confirm({
            title: 'Estás seguro que deseas eliminar estos registros?',
            okText: 'Confirmar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: () => {
                selectedRowKeys.forEach((key) => {
                    axios.delete(urlApi + "/" + key.MOD_NUMCTRL).then((response) => {
                        traerTabla()
                    })
                })
                setDeleteMany(true)
            }
        })
    }

    const onUpdateRegister = () => {
        Modal.confirm({
            title: 'Estás seguro que deseas actualizar este registro?',
            okText: 'Confirmar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: () => {
                if (img.length != 0 && valid == "YES") {
                    const data = { MOD_CLAVE: editMenu?.MOD_CLAVE, MOD_NOMBRE: editMenu?.MOD_NOMBRE, MOD_ICONO: img, MOD_DESC: editMenu?.MOD_DESC}
                    console.log(data)
                    axios.put(urlApi + "/" + editMenu?.MOD_NUMCTRL, data).then((response) => {
                        traerTabla()
                    })
                }
                else {
                    const data = { MOD_CLAVE: editMenu?.MOD_CLAVE, MOD_NOMBRE: editMenu?.MOD_NOMBRE, MOD_DESC: editMenu?.MOD_DESC}
                    console.log(data)
                    axios.put(urlApi + "/" + editMenu?.MOD_NUMCTRL, data).then((response) => {
                        traerTabla()
                    })
                }
            }
        })
    }

    const getColumnSearchProps = (dataIndex, name) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Buscar ${name}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Buscar
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters) && handleSearch(selectedKeys, confirm, dataIndex)}
                        size="small"
                        type="danger"
                        style={{
                            width: 120,
                        }}
                    >
                        Limpiar Filtros
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const [columns, setColumns] = useState([
        {
            orden: 1,
            title: <span className="dragHandler">CLAVE</span>,
            dataIndex: 'MOD_CLAVE',
            key: 'MOD_CLAVE',
            sorter: (a, b) => a.MEN_CLAVE.localeCompare(b.MEN_CLAVE),
            ...getColumnSearchProps('MOD_CLAVE', 'CLAVE'),
            visible: true,
        },
        {
            orden: 2,
            title: <span className="dragHandler">MENÚ</span>,
            dataIndex: 'MOD_NOMBRE',
            key: 'MOD_NOMBRE',
            sorter: (a, b) => a.MEN_NOMBRE.localeCompare(b.MEN_NOMBRE),
            ...getColumnSearchProps('MOD_NOMBRE', 'MENÚ'),
            visible: true,
        },
        {
            orden: 3,
            title: <span className="dragHandler">DESCRIPCIÓN</span>,
            dataIndex: 'MOD_DESC',
            key: 'MOD_DESC',
            sorter: (a, b) => a.MEN_DESC.localeCompare(b.MEN_DESC),
            ...getColumnSearchProps('MOD_DESC', 'DESCRIPCIÓN'),
            visible: true,
        },
        {
            orden: 4,
            width:20,
            title: <span className="dragHandler">ICONO</span>,
            dataIndex: 'MOD_ICONO',
            key: 'MOD_ICONO',
            render: (record) => {
                return <>
                    <img width={30} height={30} src={record}></img>
                </>
            },
            visible: true,
        },
        {
            orden: 7,
            title: <span className="dragHandler">Acción</span>,
            key: 'ASU',
            width: '10%',
            render: (record) => {
                return <>
                    <div>
                        <EditOutlined onClick={() => {
                            setEdit(true)
                            setEditMenu({ ...record })
                        }} style={{ color: "orange" }} />
                        <DeleteOutlined onClick={() => {
                            onDelete(record)
                        }} style={{
                            color: "red",
                            marginLeft: 50
                        }} />
                    </div>
                </>
            },
            visible: true,
        }
    ]);

    const [columns1, setColumns1] = useState(columns.filter(column => column.visible))

    const changeData = () => {
        data.forEach(v => {
            v.key = v.MOD_NUMCTRL
            /*             v.MAS_FECHANAC = new Date(v.MAS_FECHANAC).toLocaleDateString() */
        })
    }

    changeData()

    const rowSelection = {
        selectedRows: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRows)
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            if (selectedRows.length > 0) {
                setDeleteMany(false)
            }
            else {
                setDeleteMany(true)
            }
        }
    };

    const OnDragEnd = (fromIndex, toIndex) => {
        const columnsCopy = columns1.slice();
        const item = columnsCopy.splice(fromIndex - 1, 1)[0];
        columnsCopy.splice(toIndex - 1, 0, item);
        setColumns1(columnsCopy);
    };

    const onClick = ({ key }) => {
        const newColumns = columns
        for (var i = 0; i < newColumns.length; i++) {
            console.log(newColumns[i].dataIndex)
            if (newColumns[i].dataIndex === key) {
                newColumns[i].visible = !newColumns[i].visible;
            }
        }
        console.log(newColumns)
        setColumns1(newColumns.filter(column => column.visible));
    };

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

    const handleChan = ({ fileList: newFileList }) => {
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

    const generatePDF = () => {
        const current = new Date();
        const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
        var doc = new jsPDF('p', 'pt');
        doc.setFont(undefined, 'bold')
        doc.text(200, 30, 'Reporte de modulos.')

        doc.setFont('helvetica')
        var renglon = 150
        doc.text(440, 60, "Fecha: " + date)
        doc.text(20, 120, "Clave")
        doc.text(160, 120, "Nombre")
        doc.text(340, 120, "Descripción")
        doc.text(525, 120, "Icono")
        doc.setFont(undefined, 'normal')
        for (let index = 0; index < data.length; index++) {
            doc.text(20, renglon, data[index].MOD_CLAVE + " ")
            doc.text(160, renglon, data[index].MOD_NOMBRE + " ")
            doc.text(340, renglon, data[index].MOD_DESC + " ")
            doc.addImage(data[index].MOD_ICONO, 'JPEG', 535, renglon - 15, 20, 20);
            renglon = renglon + 30
        }

        var string = doc.output('datauristring');

        setArchPDF(string)
    }

    const menu = (
        <Menu
            onClick={onClick}
            items={[
                {
                    key: 'MOD_CLAVE',
                    label: (<Checkbox defaultChecked={true}>CLAVE</Checkbox>)
                },
                {
                    key: 'MOD_NOMBRE',
                    label: (<Checkbox defaultChecked={true}>MENÚ</Checkbox>)
                },
                {
                    key: 'MOD_DESC',
                    label: (<Checkbox defaultChecked={true}>DESCRIPCIÓN</Checkbox>)
                },
                {
                    key: 'MOD_ICONO',
                    label: (<Checkbox defaultChecked={true}>ICONO</Checkbox>)
                },
            ]}
        />
    );

    /* Vista */
    return (

        <div >
            <Row>
                <Col lg={24} md={24} sm={24} xs={24}>
                    <SaveModalModule />
                </Col>
            </Row>
            <br></br>
            <Row>
                <Col offset={2} lg={20} md={20} sm={20} xs={20}>
                    <Row>
                    <Col lg={1} md={24} sm={24} xs={24} >
                        <Button type="danger" disabled={deleteMany} onClick={() => {
                            deleteManySelected()
                        }}>
                            <DeleteOutlined />
                        </Button>
                    </Col>
                    <Col lg={1} md={24} sm={24} xs={24}>
                        <Dropdown overlay={menu} placement="bottomLeft">
                            <Button><UnorderedListOutlined style={{ fontSize: '16px', color: '#08c' }} /></Button>
                        </Dropdown>
                    </Col>
                    <Col lg={1} md={24} sm={24} xs={24}>
                        <Button type='primary' onClick={() => {
                            generatePDF()
                            setModal(true)
                        }}>IMPRIMIR</Button>
                    </Col>
                </Row><br></br>
                <ReactDragListView.DragColumn onDragEnd={OnDragEnd} nodeSelector="th">
                            <Table
                                showHeader={true}
                                rowSelection={{ type: 'checkbox', ...rowSelection, }}
                                columns={columns1}
                                dataSource={data}
                                bordered
                                size="middle"
                            />
                </ReactDragListView.DragColumn>
                </Col>
            </Row>

            <Modal title="Editar menú" okText="Actualizar" cancelText="Regresar" visible={edit} onCancel={() => {
                setEdit(false)
            }} onOk={() => {
                onUpdateRegister()
                setEdit(false)
            }}>
                <label>Clave</label>
                <Input value={editMenu?.MOD_CLAVE} required={true} onChange={(x) => {
                    setEditMenu((pre) => {
                        return { ...pre, MOD_CLAVE: x.target.value }
                    })
                }} /><br></br><br></br>
                <label>Nombre</label>
                <Input value={editMenu?.MOD_NOMBRE} required={true} onChange={(x) => {
                    setEditMenu((pre) => {
                        return { ...pre, MOD_NOMBRE: x.target.value }
                    })
                }} /><br></br><br></br>
                <label>Descripción</label>
                <Input value={editMenu?.MOD_DESC} required={true} onChange={(x) => {
                    setEditMenu((pre) => {
                        return { ...pre, MOD_DESC: x.target.value }
                    })
                }} /><br></br><br></br>

                <Upload beforeUpload={(x) => {
                    onPreview(x)
                    beforeUpload(x)
                    return false
                }}
                    accept='.png'
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleChan}
                >
                    {fileList.length < 1 && '+ Subir'}
                </Upload>

            </Modal>

            <Modal width={1000} title="Documento" okButtonProps={{ style: { display: 'none' } }} cancelText="Regresar" visible={modal} onCancel={() => {
                setModal(false)
            }}>

                <div className="viewer">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js">
                        <Viewer fileUrl={archPdf}
                            plugins={[defaultLayoutPluginInstance]}></Viewer>
                    </Worker>
                </div>

            </Modal>

        </div>
    )

}
export default GridModulo;