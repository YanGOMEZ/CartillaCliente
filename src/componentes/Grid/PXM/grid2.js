import { Button, Col, Input, Modal, Row, Table, Dropdown, Menu, Checkbox, Space, Select, message } from "antd";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import '../../../componentes.css';
import ReactDragListView from "react-drag-listview";
import { UnorderedListOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import Highlighter from 'react-highlight-words';
import FormPXM from "./formSavePXM";

//PDF
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
//GENERA PDF
import jsPDF from 'jspdf'

const urlApi = process.env.REACT_APP_URL_SERVER + '/menu';
const urlApi2 = process.env.REACT_APP_URL_SERVER + '/proxmen'

function PmGrid() {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [data, setData] = useState([])
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [edit, setEdit] = useState(false);
    const [editMenu, setEditMenu] = useState(null);
    const [nombre, setNombre] = useState("")
    const [BY, setBY] = useState("ASC")
    const [deleteMany, setDeleteMany] = useState(true)
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [men, setmen] = useState("")
    const [estado, setestado] = useState(false)
    const [aux, setAux] = useState(0)
    const [padre, setPadre] = useState(0)
    const [modal, setModal] = useState(false);
    const [inputs, setInput] = useState(true)

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [archPdf, setArchPDF] = useState(null);


    const key = 'updatable';

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };


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

    useEffect(() => {
        traerTabla()
        actualizado()
    }, [nombre, BY, men, padre, data3])

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
    }

    const traerTabla3 = async (clave) => {
        if (clave == null) {
            clave = men
        }
        axios.post(urlApi2, { MEN_NUMCTRL: clave, PRG_NOMBRE: "", PRG_CLAVE: "", PRG_DESC: "", MEN_NOMBRE: "", ORDER: "PXM_ORDEN", BY: "" }, {

            "headers": {

                "content-type": "application/json",

            },

        }).then((response) =>
            setData3(response.data)
        ).catch(error => {
            console.log(error);
        })
    }

    const onDelete = (id) => {
        Modal.confirm({
            title: 'Estás seguro que deseas eliminar este registro?',
            okText: 'Confirmar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: () => {
                axios.delete(urlApi2 + "/" + id.PXM_NUMCTRL).then((response) => {
                    traerTabla2(id.MEN_NUMCTRL)
                    traerTabla3()
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
                    axios.delete(urlApi2 + "/" + key.PXM_NUMCTRL).then((response) => {
                        traerTabla2()
                        traerTabla3()
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
                if (editMenu?.PXM_ORDEN > data3.length) {
                    message.error({
                        content: 'Elegiste un orden mayor al limite!', key, duration: 4, style: {
                            marginTop: '18vh',
                        },
                    });
                }
                else if (editMenu?.PXM_ORDEN <= 0) {
                    message.error({
                        content: 'Elegiste un orden menor al limite!', key, duration: 4, style: {
                            marginTop: '18vh',
                        },
                    });
                }
                else {
                    const data = { PXM_ORDEN: editMenu?.PXM_ORDEN }
                    axios.put(urlApi2 + "/" + editMenu?.PXM_NUMCTRL, data).then((response) => {
                        traerTabla2()
                        traerTabla3()
                    })
                }
            }
        })
    }

    const [columns, setColumns] = useState([
        {
            orden: 1,
            title: <span className="dragHandler">CLAVE</span>,
            dataIndex: 'PRG_CLAVE',
            key: 'PRG_CLAVE',
            sorter: (a, b) => a.MAS_NOMBRE.localeCompare(b.MAS_NOMBRE),
            ...getColumnSearchProps('PRG_CLAVE', 'Mascota'),
            visible: true
        },
        {
            orden: 2,
            title: <span className="dragHandler">ORDEN</span>,
            dataIndex: 'PXM_ORDEN',
            key: 'PXM_ORDEN',
            sorter: (a, b) => a.PRO_NOMBRE.localeCompare(b.PRO_NOMBRE),
            ...getColumnSearchProps('PXM_ORDEN', 'Propietario'),
            visible: true
        },
        {
            orden: 3,
            title: <span className="dragHandler">PROGRAMA</span>,
            dataIndex: 'PRG_NOMBRE',
            key: 'PRG_NOMBRE',
            sorter: (a, b) => a.MAS_FECHANAC.localeCompare(b.MAS_FECHANAC),
            ...getColumnSearchProps('PRG_NOMBRE', 'Fecha de nacimiento'),
            visible: true
        },
        {
            title: <span className="dragHandler">Accion</span>,
            key: 'ASU',
            width: '8%',
            align: 'center',
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
            visible: true
        }
    ]);

    const [columns1, setColumns1] = useState(columns.filter(column => column.visible))

    const changeData = () => {
        data2.forEach(v => {
            v.key = v.PXM_NUMCTRL
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

    const ordenar = () => {
        if (BY === "ASC") {
            setBY("DESC")
        }
        else {
            setBY("ASC")
        }
    }

    const OnDragEnd = (fromIndex, toIndex) => {
        const columnsCopy = columns1.slice();
        const item = columnsCopy.splice(fromIndex - 1, 1)[0];
        columnsCopy.splice(toIndex - 1, 0, item);
        setColumns1(columnsCopy);
    };

    const onClick = ({ key }) => {
        const newColumns = columns
        for (var i = 0; i < newColumns.length; i++) {
            if (newColumns[i].dataIndex === key) {
                newColumns[i].visible = !newColumns[i].visible;
            }
        }
        setColumns1(newColumns.filter(column => column.visible));
    };


    const handleVisibleChange = (flag) => {
        setDropdownVisible(flag);
    }

    const generatePDF = () => {
        const current = new Date();
        const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
        var doc = new jsPDF('p', 'pt');
        doc.setFont(undefined, 'bold')
        doc.text(160, 30, 'Reporte de programas por menú.')

        doc.setFont('helvetica')
        var renglon = 150
        doc.text(400, 60, "Fecha: " + date)
        doc.text(20, 120, "Programa")
        doc.text(230, 120, "Orden")
        doc.text(400, 120, "Etiqueta")
        doc.setFont(undefined, 'normal')
        for (let index = 0; index < data2.length; index++) {
            doc.text(20, 60, "Menú: " + data2[index].MEN_CLAVE + " " + data2[index].MEN_NOMBRE + " ")
            doc.text(20, renglon, data2[index].PRG_CLAVE)
            doc.text(245, renglon, data2[index].PXM_ORDEN + " ")
            doc.text(400, renglon, data2[index].PRG_NOMBRE + " ")
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
                    key: 'PRG_CLAVE',
                    label: (<Checkbox defaultChecked={true}>CLAVE</Checkbox>)
                },
                {
                    key: 'PXM_ORDEN',
                    label: (<Checkbox defaultChecked={true}>ORDEN</Checkbox>)
                },
                {
                    key: 'PRG_NOMBRE',
                    label: (<Checkbox defaultChecked={true}>PROGRAMA</Checkbox>)
                },
            ]}
        />
    );

    const traerTabla2 = async (clave) => {
        if (clave == null) {
            clave = men
        }
        axios.post(urlApi2, { MEN_NUMCTRL: clave, ORDER: "PXM_ORDEN" }, {

            "headers": {

                "content-type": "application/json",

            },

        }).then((response) =>
            setData2(response.data)
        ).catch(error => {
            console.log(error);
        })
    }

    let dataLIST = data.length > 0
        && data.map((item, i = 0) => {
            return (
                <Select.Option key={i} value={item.MEN_NUMCTRL}>{item.MEN_NOMBRE}</Select.Option>
            )
        }, this);

    const handleChange = (value) => {
        console.log(value)
        setmen(value)
        traerTabla2(value)
        if (value != "") {
            setestado(true)
            setInput(false)
            setAux(1)
        }
        traerTabla3(value)
    }

    const handler = (param) => {
        setPadre(param)
    }

    const actualizado = () => {
        if (padre == 1) {
            setTimeout(() => {
                traerTabla2()
                traerTabla3()
                setPadre(0)
                setestado(false)
            }, 3000);
        }
        if (aux != 0) {
            setestado(true)
        }
    }

    const visibleModal = () => {
        generatePDF()
        if (modal == false) {
            setModal(true)
        }
        else {
            setModal(false)
        }
    }

    return (

        <div >
            <Row>
                <Col xs={22} sm={20} md={16} lg={10}>
                    <Select defaultValue={men} style={{ width: '100%' }} onChange={e => handleChange(e)}>
                        {dataLIST}
                    </Select>
                </Col>
                <Col style={{ marginLeft: 10 }} xs={1} sm={2} md={4} lg={7}>
                    {estado ? <FormPXM tb={data2} op={data3.length + 1} valor={men} padre={handler} /> : undefined}
                </Col>
                <Col><Button type='primary' disabled={inputs} htmlType="submit" onClick={() => {
                    visibleModal()
                }}>IMPRIMIR</Button>
                </Col>
            </Row><br></br>
            <Row>
                <Col span={21} >

                </Col>
                <Col span={1} >
                    <Button onClick={() => {
                        traerTabla()
                    }}>
                        <ReloadOutlined />
                    </Button>
                </Col>
                <Col span={1} >
                    <Button type="danger" disabled={deleteMany} onClick={() => {
                        deleteManySelected()
                    }}>
                        <DeleteOutlined />
                    </Button>
                </Col>
                <Col span={1}>
                    <Dropdown overlay={menu} onVisibleChange={handleVisibleChange}
                        visible={dropdownVisible} placement="bottomLeft">
                        <Button><UnorderedListOutlined style={{ fontSize: '16px', color: '#08c' }} /></Button>
                    </Dropdown>
                </Col>
            </Row><br></br>
            <ReactDragListView.DragColumn onDragEnd={OnDragEnd} nodeSelector="th">
                <Table
                    showHeader={true}
                    rowSelection={{ type: 'checkbox', ...rowSelection, }}
                    columns={columns1}
                    dataSource={data2}
                    bordered
                    size="middle"
                />
            </ReactDragListView.DragColumn>
            <Modal title="Editar orden" okText="Actualizar" cancelText="Regresar" visible={edit} onCancel={() => {
                setEdit(false)
            }} onOk={() => {
                onUpdateRegister()
                setEdit(false)
            }}>
                <label>Orden</label>
                <Input value={editMenu?.PXM_ORDEN} required={true} onChange={(x) => {
                    setEditMenu((pre) => {
                        return { ...pre, PXM_ORDEN: x.target.value }
                    })
                }} /><br></br><br></br>

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
export default PmGrid;