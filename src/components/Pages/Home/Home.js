import React, { useEffect, useRef, useState } from 'react'
import { Alert, Button, Col, Collapse, Form, ListGroup, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { createTemplate, updateTemplate } from '../../../Redux/rootForm/rootFormActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
    const listCss = { cursor: 'pointer', listStyle: 'none', margin: '3px', padding: '10px', border: '1px dashed #ddd' }
    const formElements = ['Text', 'Number', 'Email', 'CheckBox', 'TextArea', 'Date']
    const [formFields, setFormFields] = useState([]);
    const [name, setName] = useState('');
    const [enableControls, setEnableControls] = useState(false)
    const [showAlert, setShowAlert] = useState(false);
    const dispatch = useDispatch();
    const ref = useRef(null);
    const [formTemplate, setFormTemplate] = useState([]);
    const [global, setGlobal] = useState([]);
    const product = useSelector(state => state)
    const [inUpdateView, setInUpdateView] = useState(false);
    const [isEditable, setisEditable] = useState(false);
    const [ind, setInd] = useState('');
    var [labelObj, setLabelObj] = useState({});

    const getSelected = (value, index) => {
        // if (inUpdateView) return
        if (name !== '') {
            let item = value;
            let type = "";
            let label = "";
            let tempArr = formFields && formFields.length ? [...formFields] : [];
            let field = {
                type: "",
                label: ""
            }
            switch (item) {
                case 'Text':
                    type = "text"
                    label = "Text"
                    break
                case 'Number':
                    type = "number"
                    label = "Number"
                    break
                case 'Email':
                    type = "email"
                    label = "Email"
                    break
                case 'CheckBox':
                    type = "checkbox"
                    label = "Check"
                    break
                case 'TextArea':
                    type = "textArea"
                    label = "Text Area"
                    break
                case 'Date':
                    type = "date"
                    label = "Select Date"
                    break
            }
            field.type = type;
            field.label = label + '_' + tempArr.length
            field.displayLabel = label
            tempArr.push(field);
            setFormFields(tempArr);
            setGlobal(tempArr);
            setShowAlert(false);
        } else {
            setShowAlert(true);
        }
    }

    const enableInput =() => {
        if (formFields && formFields.length) {
            setFormFields([]);
            setName('');
        }
        setInUpdateView(false);
        setEnableControls(true);
    }

    const nameChange =(e)  =>{
        setName(e.target.value);
    }

    const showToast = (args)=> {
        toast.success(args, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
        });
    }


    const saveForm =() => {
        if (global && global.length) {
            setShowAlert(false);
            let tempObj = {}
            tempObj['formFields'] = global;
            console.log(tempObj['formFields']);
            tempObj['formName'] = name;
            let tempArr = formTemplate && formTemplate.length ? [...formTemplate] : [];
            tempArr.push(name);
            setFormTemplate(tempArr);
            dispatch(createTemplate(tempObj));
            setName('');
            setFormFields([]);
            setEnableControls(false);
            showToast('Created Successfully');
        } else {
            setShowAlert(true);
        }
    }

    const updateForm =()  =>{
        if (global && global.length) {
            let tempObj = {}
            tempObj['formFields'] = global;
            tempObj['formName'] = name;
            dispatch(updateTemplate(tempObj));
            setName('');
            setFormFields([]);
            setEnableControls(false);
            showToast(`${name} Updated Succesfully`);
        }
    }

    const deleteFormElement =(item, index) => {
        let tempFields = [...formFields];
        tempFields.splice(index, 1);
        setFormFields(tempFields);
        setGlobal(tempFields)
    }

    const displaySelectedTemplate =(item, index) => {
        let tempForm = product.form.forms[item]['metaData'];
        setEnableControls(true);
        setInUpdateView(true);
        setName(item);
        setFormFields(tempForm)
    }

    const editSelectedLable =(props) => {
        setInd(props?.indexing)
        setisEditable(!isEditable);
    }

    const modifyLabelName = (event, props) => {
        let tempObj = {};
        tempObj['type'] = props?.data?.data['type'];
        tempObj['displayLabel'] = event.target.value;
        tempObj['label'] = event.target.value + '_' + props?.data?.indexing;
        tempObj['index'] = props?.data?.indexing;
        console.log(labelObj);
        labelObj = tempObj;
    }

    const renameLabels =() => {
        let tempArr = formFields && formFields.length ? [...formFields] : [];
        tempArr[labelObj?.index] = labelObj;
        setFormFields(tempArr);
        setGlobal(tempArr);
        setisEditable(!isEditable);
    }

    useEffect(() => {
        if (product && product.form && product.form.forms) {
            let tempObj = Object.keys(product.form.forms);
            setFormTemplate(tempObj);
        }
    }, [product]);

    const EmailTag =(props)  =>{
        return (
            <Form.Group controlId="formBasicEmail" >
                <Form.Label>{props?.data?.displayLabel}</Form.Label>{' '}<FontAwesomeIcon icon={isEditable && props.indexing === ind ? faCheckCircle : faEdit} onClick={() => { isEditable && props.indexing === ind ? renameLabels() : editSelectedLable(props) }} aria-controls="example-collapse-text" aria-expanded={isEditable} />
                {props.indexing === ind && <EditLabel data={props} />}
                <Form.Control type="email" placeholder="Enter email" readOnly />
                <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
            </Form.Group >
        )
    }
    const TextTag =(props) => {
        return (
            <Form.Group controlId="formBasicEmail">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>{' '}<FontAwesomeIcon icon={isEditable && props.indexing === ind ? faCheckCircle : faEdit} onClick={() => { isEditable && props.indexing === ind ? renameLabels() : editSelectedLable(props) }} aria-controls="example-collapse-text" aria-expanded={isEditable} />
                {props.indexing === ind && <EditLabel data={props} />}
                <Form.Control type="text" placeholder="Enter Text" readOnly />
            </Form.Group>
        )
    }
    const NumberTag =(props) => {
        return (
            <Form.Group controlId="formBasicEmail">
                <Form.Label >{props?.data?.displayLabel}</Form.Label>{' '}<FontAwesomeIcon icon={isEditable && props.indexing === ind ? faCheckCircle : faEdit} onClick={() => { isEditable && props.indexing === ind ? renameLabels() : editSelectedLable(props) }} aria-controls="example-collapse-text" aria-expanded={isEditable} />
                {props.indexing === ind && <EditLabel data={props} />}
                <Form.Control type="number" placeholder="12345...." readOnly />
            </Form.Group>
        )
    }
    const CheckBox =(props) => {
        return (
            <Form.Group controlId="formBasicCheckbox">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>{' '}<FontAwesomeIcon icon={isEditable && props.indexing === ind ? faCheckCircle : faEdit} onClick={() => { isEditable && props.indexing === ind ? renameLabels() : editSelectedLable(props) }} aria-controls="example-collapse-text" aria-expanded={isEditable} />
                {props.indexing === ind && <EditLabel data={props} />}
                <Form.Check type="checkbox" label="Check me out" disabled />
            </Form.Group>
        )
    }
    const TextArea =(props)  =>{
        return (
            <Form.Group controlId="formBasicTextArea">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>{' '}<FontAwesomeIcon icon={isEditable && props.indexing === ind ? faCheckCircle : faEdit} onClick={() => { isEditable && props.indexing === ind ? renameLabels() : editSelectedLable(props) }} aria-controls="example-collapse-text" aria-expanded={isEditable} />
                {props.indexing === ind && <EditLabel data={props} />}
                <textarea className="form-control" rows="3" col="3" id="comment" disabled></textarea>
            </Form.Group>
        )
    }
    const DateArea =(props) => {
        return (
            <Form.Group controlId="formBasicDate">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>{' '}<FontAwesomeIcon icon={isEditable && props.indexing === ind ? faCheckCircle : faEdit} onClick={() => { isEditable && props.indexing === ind ? renameLabels() : editSelectedLable(props) }} aria-controls="example-collapse-text" aria-expanded={isEditable} />
                {props.indexing === ind && <EditLabel data={props} />}
                <Form.Check type="date" disabled />
            </Form.Group>
        )
    }

    const ShowAlert =() => {
        return (
            <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                <Alert.Heading><h6>{name === '' ? 'Cannot add form field without a name' : 'Please add atleast one form element'}</h6></Alert.Heading>
            </Alert>
        )
    }

    const EditLabel = (props) =>{
        return (
            <Collapse in={isEditable} >
                <div id="example-collapse-text">
                    <Form.Control placeholder="Enter Label Name" size="sm" type="text" onChange={(e) => modifyLabelName(e, props)} />
                </div>
            </Collapse>
        )
    }

    return (
        <>
            <div>
                {showAlert && <ShowAlert />}
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <ToastContainer />
                <Row className="m-0">
                    <Col  className="border-right section left-section col-md-3 py-2 px-4" >
                        <div className="d-flex justify-content-end">
                            <button type="button" onClick={enableInput} > Create New Form</button>
                        </div>
                        <h6>Created Forms</h6>

                        <div className="mt-2"></div>
                        {formTemplate.map((item, index) => (
                            <ListGroup.Item key={index} style={listCss} onClick={() => displaySelectedTemplate(item, index)} action>{item} </ListGroup.Item>
                        ))}
                        <br />
                    </Col>
                    <Col className=" col-md-6 border-right section section-two py-2 px-4">
                        <h6  >{inUpdateView ? 'Created Form Template' : 'Create New Form Template'}</h6>
                        <div style={{ display: enableControls ? "block" : "none" }} ref={ref}>
                            <Form>
                                <Form.Row>
                                    <Col>
                                        <Form.Control placeholder="name....." value={name || ''} type="text" onChange={nameChange} readOnly={inUpdateView} />
                                    </Col>
                                    <Button variant="primary" size="sm" onClick={!inUpdateView ? saveForm : updateForm} disabled={!name}>
                                        {!inUpdateView ? 'Save Form' : 'Update Form'}</Button>
                                </Form.Row>
                            </Form>
                            <br />
                            {formFields && formFields.map((item, index) => {
                                return (<div key={index}>
                                    <Form>
                                        <Form.Row>
                                            <Col>
                                                {item.type === 'email' && <EmailTag data={item} indexing={index} />}
                                                {item.type === 'text' && <TextTag data={item} indexing={index} />}
                                                {item.type === 'number' && <NumberTag data={item} indexing={index} />}
                                                {item.type === 'checkbox' && <CheckBox data={item} indexing={index} />}
                                                {item.type === 'textArea' && <TextArea data={item} indexing={index} />}
                                                {item.type === 'date' && <DateArea data={item} indexing={index} />}
                                            </Col>
                                            {/* {!inUpdateView && <FontAwesomeIcon style={{ "marginTop": '6%', "cursor": "pointer" }} onClick={() => deleteFormElement(item, index)} icon={faTrashAlt} />} */}
                                            <FontAwesomeIcon style={{ "marginTop": '6%', "cursor": "pointer" }} onClick={() => deleteFormElement(item, index)} icon={faTrashAlt} />
                                        </Form.Row>
                                    </Form>
                                </div>)
                            })}
                        </div>
                    </Col>

                    <Col className=" col-md-3 section section-three py-2 px-4">
                        <h6 >Form Elements</h6>
                        <div>
                            <ListGroup>
                                {formElements.map((item, index) => (
                                    <ListGroup.Item key={index} style={listCss} onClick={() => getSelected(item, index)}>{item}</ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Home
