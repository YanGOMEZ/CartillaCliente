import { Button, Col, Input, Modal, Row, Table, Dropdown, Menu, Checkbox, message, Upload, Space } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import '../../../componentes.css';
import ReactDragListView from "react-drag-listview";
import { UnorderedListOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { Autocomplete, TextField } from "@mui/material";

//PDF
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
//GENERA PDF
import jsPDF from 'jspdf'
import { SearchOutlined } from "@mui/icons-material";
import Highlighter from "react-highlight-words";
import SaveModalMenu from "./saveModalMenu";


const urlApi = process.env.REACT_APP_URL_SERVER + '/menu';
const urlApisub = process.env.REACT_APP_URL_SERVER + '/submenu';

function CustomGrid() {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [data, setData] = useState([])
    const [edit, setEdit] = useState(false);
    const [editMenu, setEditMenu] = useState(null);
    const [nombre, setNombre] = useState("")
    const [ORD, setORD] = useState("MEN_CLAVE")
    const [BY, setBY] = useState("ASC")
    const [deleteMany, setDeleteMany] = useState(true)
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [datasub, setDatasub] = useState([])
    const [fileList, setFileList] = useState([])
    const [valid, setValid] = useState("")
    const [img, setImg] = useState("")
    const [archPdf, setArchPDF] = useState(null);
    const [modal, setModal] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null)



    useEffect(() => {
        traerTabla()
        traerTabla2()
    }, [nombre, BY, fileList, img])

    const traerTabla2 = async () => {
        axios.post(urlApisub, {}, {

            "headers": {

                "content-type": "application/json",

            },

        }).then((response) =>
            setDatasub(response.data)
        ).catch(error => {
            console.log(error);
        })
    }

    const traerTabla = async () => {
        axios.post(urlApi, { MEN_NOMBRE: nombre, ORDER: ORD, BY: BY }, {

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
                axios.delete(urlApi + "/" + record.MEN_NUMCTRL).then((response) => {
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
                    axios.delete(urlApi + "/" + key.MEN_NUMCTRL).then((response) => {
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
                var cantidad = 0
                for (let index = 0; index < data.length; index++) {
                    if (data[index].SUM_NUMCTRL == editMenu?.SUM_NUMCTRL) {
                        cantidad = cantidad + 1
                    }
                }
                if (editMenu?.MEN_ORDEN > cantidad) {
                    message.error({
                        content: 'Elegiste un orden mayor al limite!', duration: 4, style: {
                            marginTop: '18vh',
                        },
                    });
                }
                else if (editMenu?.MEN_ORDEN <= 0) {
                    message.error({
                        content: 'Elegiste un orden menor al limite!', duration: 4, style: {
                            marginTop: '18vh',
                        },
                    });
                }
                else {
                    var im
                    console.log(editMenu?.MEN_ICON.length + " edit")
                    console.log(img.length)
                    if (img.length != 0 && valid == "YES") {
                        const data = { MEN_ORDEN: editMenu?.MEN_ORDEN, MEN_CLAVE: editMenu?.MEN_CLAVE, MEN_NOMBRE: editMenu?.MEN_NOMBRE, MEN_ICON: img, MEN_DESC: editMenu?.MEN_DESC, SUM_NUMCTRL: editMenu?.SUM_NUMCTRL }
                        console.log(data)
                        axios.put(urlApi + "/" + editMenu?.MEN_NUMCTRL, data).then((response) => {
                            traerTabla()
                        })
                    }
                    else {
                        const data = { MEN_ORDEN: editMenu?.MEN_ORDEN, MEN_CLAVE: editMenu?.MEN_CLAVE, MEN_NOMBRE: editMenu?.MEN_NOMBRE, MEN_DESC: editMenu?.MEN_DESC, SUM_NUMCTRL: editMenu?.SUM_NUMCTRL }
                        console.log(data)
                        axios.put(urlApi + "/" + editMenu?.MEN_NUMCTRL, data).then((response) => {
                            traerTabla()
                        })
                    }
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
            dataIndex: 'MEN_CLAVE',
            key: 'MEN_CLAVE',
            sorter: (a, b) => a.MEN_CLAVE.localeCompare(b.MEN_CLAVE),
            ...getColumnSearchProps('MEN_CLAVE', 'CLAVE'),
            visible: true
        },
        {
            orden: 2,
            title: <span className="dragHandler">MENÚ</span>,
            dataIndex: 'MEN_NOMBRE',
            key: 'MEN_NOMBRE',
            sorter: (a, b) => a.MEN_NOMBRE.localeCompare(b.MEN_NOMBRE),
            ...getColumnSearchProps('MEN_NOMBRE', 'MENÚ'),
            visible: true
        },
        {
            orden: 3,
            title: <span className="dragHandler">DESCRIPCIÓN</span>,
            dataIndex: 'MEN_DESC',
            key: 'MEN_DESC',
            sorter: (a, b) => a.MEN_DESC.localeCompare(b.MEN_DESC),
            ...getColumnSearchProps('MEN_DESC', 'DESCRIPCIÓN'),
            visible: true
        },
        {
            orden: 4,
            title: <span className="dragHandler">ETIQUETA</span>,
            dataIndex: 'SUM_ETIQUETA',
            key: 'SUM_ETIQUETA',
            sorter: (a, b) => a.SUM_ETIQUETA.localeCompare(b.SUM_ETIQUETA),
            ...getColumnSearchProps('SUM_ETIQUETA', 'ETIQUETA'),
            visible: true
        },
        {
            orden: 5,
            title: <span className="dragHandler">ORDEN</span>,
            dataIndex: 'MEN_ORDEN',
            key: 'MEN_ORDEN',
            sorter: (a, b) => a.MEN_ORDEN - b.MEN_ORDEN,
            ...getColumnSearchProps('MEN_ORDEN', 'ORDEN'),
            visible: true
        },
        {
            orden: 6,
            title: <span className="dragHandler">ICONO</span>,
            dataIndex: 'MEN_ICON',
            key: 'MEN_ICON',
            render: (record) => {
                return <>
                    <img width={30} height={30} src={record}></img>
                </>
            },
            visible: true
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
            visible: true
        }
    ]);

    const [columns1, setColumns1] = useState(columns.filter(column => column.visible))

    const changeData = () => {
        data.forEach(v => {
            v.key = v.MEN_NUMCTRL
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

    const existentes = () => {
        for (let index = 0; index < datasub.length; index++) {
            const element = { label: datasub[index].SUM_ETIQUETA, valor: datasub[index].SUM_NUMCTRL }
            exist.push(element)
        }
    }

    const exist = []

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
        doc.text(160, 30, 'Reporte de catálogo de menús.')

        doc.setFont('helvetica')
        var renglon = 150
        doc.text(400, 60, "Fecha: " + date)
        doc.text(20, 120, "Clave")
        doc.text(150, 120, "Etiqueta")
        doc.text(300, 120, "Descripción")
        doc.text(525, 120, "Icono")
        doc.setFont(undefined, 'normal')
        for (let index = 0; index < data.length; index++) {
            doc.text(20, renglon, data[index].MEN_CLAVE)
            doc.text(110, renglon, data[index].SUM_ETIQUETA + " ")
            doc.text(280, renglon, data[index].MEN_DESC + " ")
            doc.addImage(data[index].MEN_ICON, 'JPEG', 535, renglon - 15, 20, 20);
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
                    key: 'MEN_CLAVE',
                    label: (<Checkbox defaultChecked={true}>CLAVE</Checkbox>)
                },
                {
                    key: 'MEN_NOMBRE',
                    label: (<Checkbox defaultChecked={true}>MENÚ</Checkbox>)
                },
                {
                    key: 'MEN_DESC',
                    label: (<Checkbox defaultChecked={true}>DESCRIPCIÓN</Checkbox>)
                },
                {
                    key: 'SUM_ETIQUETA',
                    label: (<Checkbox defaultChecked={true}>ETIQUETA</Checkbox>)
                },
                {
                    key: 'MEN_ORDEN',
                    label: (<Checkbox defaultChecked={true}>ORDEN</Checkbox>)
                },
                {
                    key: 'MEN_ICON',
                    label: (<Checkbox defaultChecked={true}>ICONO</Checkbox>)
                },
            ]}
        />
    );

    return (

        <div >
            <Row>
                <Col lg={24}>
                    <SaveModalMenu />
                </Col>
            </Row>
            <br></br>
            <Row>
                <Col span={1} >
                    <Button type="danger" disabled={deleteMany} onClick={() => {
                        deleteManySelected()
                    }}>
                        <DeleteOutlined />
                    </Button>
                </Col>
                <Col span={1}>
                    <Dropdown overlay={menu} placement="bottomLeft">
                        <Button><UnorderedListOutlined style={{ fontSize: '16px', color: '#08c' }} /></Button>
                    </Dropdown>
                </Col>
                <Col>
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

            <Modal title="Editar menú" okText="Actualizar" cancelText="Regresar" visible={edit} onCancel={() => {
                setEdit(false)
            }} onOk={() => {
                onUpdateRegister()
                setEdit(false)
            }}>
                <label>Clave</label>
                <Input value={editMenu?.MEN_CLAVE} required={true} onChange={(x) => {
                    setEditMenu((pre) => {
                        return { ...pre, MEN_CLAVE: x.target.value }
                    })
                }} /><br></br><br></br>
                <label>Nombre</label>
                <Input value={editMenu?.MEN_NOMBRE} required={true} onChange={(x) => {
                    setEditMenu((pre) => {
                        return { ...pre, MEN_NOMBRE: x.target.value }
                    })
                }} /><br></br><br></br>
                <label>Descripción</label>
                <Input value={editMenu?.MEN_DESC} required={true} onChange={(x) => {
                    setEditMenu((pre) => {
                        return { ...pre, MEN_DESC: x.target.value }
                    })
                }} /><br></br><br></br>

                <Autocomplete onClick={existentes()} onChange={(evemt, value) => setEditMenu((pre) => {
                    return { ...pre, SUM_NUMCTRL: value.valor }
                })}
                    disablePortal
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option) => option.valor}
                    id="combo-box-demo"
                    options={exist}
                    sx={{ width: 315 }}
                    renderInput={(params) => <TextField {...params} label={editMenu?.SUM_ETIQUETA} />}
                /><br></br>
                <label>Orden</label>
                <Input value={editMenu?.MEN_ORDEN} placeholder="ORDEN" onChange={(x) => {
                    setEditMenu((pre) => {
                        return { ...pre, MEN_ORDEN: x.target.value }
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
export default CustomGrid;