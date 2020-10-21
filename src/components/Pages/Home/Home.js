import React, { useEffect, useRef, useState } from 'react'
import { Alert, Button, Col, Collapse, Form, ListGroup, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { createTemplate } from '../../../Redux/rootForm/rootFormActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';


function Home() {
    const formElements = 
    ['Text Field', 'Number Field', 'Email Field', 'CheckBox Field', 'TextArea Field', 'Date Field']
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

    

    const enableInput=()=> {
        if (formFields && formFields.length) {
            setFormFields([]);
            setName('');
        }
        setInUpdateView(false);
        setEnableControls(true);
    }

    const nameChange=(e)=> {
        setName(e.target.value);
    }

    const saveForm=() =>{
        if (global && global.length) {
            setShowAlert(false);
            let tempObj = {}
            tempObj['formFields'] = global;
            tempObj['formName'] = name;
            let tempArr = formTemplate && formTemplate.length ? [...formTemplate] : [];
            tempArr.push(name);
            setFormTemplate(tempArr);
            dispatch(createTemplate(tempObj));
            setName('');
            setFormFields([]);
            setEnableControls(false);
        } else {
            setShowAlert(true);
        }
    }

    const deleteFormElement =(item, index)=> {
        let tempFields = [...formFields];
        tempFields.splice(index, 1);
        setFormFields(tempFields);
        setGlobal(tempFields)
    }

    const displaySelectedTemplate = (item, index)=>{
        let tempForm = product.form.forms[item]['metaData'];
        setEnableControls(true);
        setInUpdateView(true);
        setName(item);
        setFormFields(tempForm)
    }

    const editSelectedLable = (props) =>{
        setInd(props?.indexing)
        setisEditable(!isEditable);
    }

    const modifyLabelName = (event, props) => {
        let tempObj = {};
        tempObj['type'] = props?.data?.data['type'];
        tempObj['displayLabel'] = event.target.value;
        tempObj['label'] = event.target.value + '_' + props?.data?.indexing;
        tempObj['index'] = props?.data?.indexing;
        labelObj = tempObj;
    }

    const renameLabels = ()=> {
        let tempArr = formFields && formFields.length ? [...formFields] : [];
        tempArr[labelObj?.index] = labelObj;
        setFormFields(tempArr);
        setGlobal(tempArr);
        setisEditable(!isEditable);
    }
    const getSelected = (value, index) => {
        if (inUpdateView) return
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
                case 'Text Field':
                    type = "text"
                    label = "Text"
                    break
                case 'Number Field':
                    type = "number"
                    label = "Number"
                    break
                case 'Email Field':
                    type = "email"
                    label = "Email"
                    break
                case 'CheckBox Field':
                    type = "checkbox"
                    label = "Check"
                    break
                case 'TextArea Field':
                    type = "textArea"
                    label = "Text Area"
                    break
                case 'Date Field':
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

    useEffect(() => {
        if (product && product.form && product.form.forms) {
            let tempObj = Object.keys(product.form.forms);
            setFormTemplate(tempObj);
        }
    }, [product]);

    const EmailTag = (props) => {
        return (
            < Form.Group controlId="formBasicEmail" >
                <Form.Label>{props?.data?.displayLabel}</Form.Label>{' '}<FontAwesomeIcon style={{ display: inUpdateView ? 'none' : '' }} icon={isEditable && props.indexing === ind ? faCheckCircle : faEdit} onClick={() => { isEditable && props.indexing === ind ? renameLabels() : editSelectedLable(props) }} aria-controls="example-collapse-text" aria-expanded={isEditable} />
                {props.indexing === ind && <EditLabel data={props} />}
                <Form.Control type="email" placeholder="Enter email" readOnly />
                <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
            </Form.Group >
        )
    }
    const TextTag = (props) => {
        return (
            <Form.Group controlId="formBasicEmail">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>{' '}<FontAwesomeIcon style={{ display: inUpdateView ? 'none' : '' }} icon={isEditable && props.indexing === ind ? faCheckCircle : faEdit} onClick={() => { isEditable && props.indexing === ind ? renameLabels() : editSelectedLable(props) }} aria-controls="example-collapse-text" aria-expanded={isEditable} />
                {props.indexing === ind && <EditLabel data={props} />}
                <Form.Control type="text" placeholder="Enter Text" readOnly />
            </Form.Group>
        )
    }
    const  NumberTag = (props) => {
        return (
            <Form.Group controlId="formBasicEmail">
                <Form.Label >{props?.data?.displayLabel}</Form.Label>{' '}<FontAwesomeIcon style={{ display: inUpdateView ? 'none' : '' }} icon={isEditable && props.indexing === ind ? faCheckCircle : faEdit} onClick={() => { isEditable && props.indexing === ind ? renameLabels() : editSelectedLable(props) }} aria-controls="example-collapse-text" aria-expanded={isEditable} />
                {props.indexing === ind && <EditLabel data={props} />}
                <Form.Control type="number" placeholder="12345...." readOnly />
            </Form.Group>
        )
    }
    const CheckBox = (props) =>{
        return (
            <Form.Group controlId="formBasicCheckbox">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>{' '}<FontAwesomeIcon style={{ display: inUpdateView ? 'none' : '' }} icon={isEditable && props.indexing === ind ? faCheckCircle : faEdit} onClick={() => { isEditable && props.indexing === ind ? renameLabels() : editSelectedLable(props) }} aria-controls="example-collapse-text" aria-expanded={isEditable} />
                {props.indexing === ind && <EditLabel data={props} />}
                <Form.Check type="checkbox" label="Check me out" disabled />
            </Form.Group>
        )
    }
    const TextArea = (props) =>{
        return (
            <Form.Group controlId="formBasicTextArea">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>{' '}<FontAwesomeIcon style={{ display: inUpdateView ? 'none' : '' }} icon={isEditable && props.indexing === ind ? faCheckCircle : faEdit} onClick={() => { isEditable && props.indexing === ind ? renameLabels() : editSelectedLable(props) }} aria-controls="example-collapse-text" aria-expanded={isEditable} />
                {props.indexing === ind && <EditLabel data={props} />}
                <textarea className="form-control" rows="3" col="3" id="comment" disabled></textarea>
            </Form.Group>
        )
    }
    const DateArea = (props) => {
        return (
            <Form.Group controlId="formBasicDate">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>{' '}<FontAwesomeIcon style={{ display: inUpdateView ? 'none' : '' }} icon={isEditable && props.indexing === ind ? faCheckCircle : faEdit} onClick={() => { isEditable && props.indexing === ind ? renameLabels() : editSelectedLable(props) }} aria-controls="example-collapse-text" aria-expanded={isEditable} />
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

    const EditLabel = (props) => {
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
                <Row className="m-0">
                    <Col  className="border-right section left-section col-md-3 py-2 px-4" >
                        <div className="d-flex justify-content-end">
                            <button type="button" onClick={enableInput} > Create New Form</button>
                        </div>
                        <h6>Created Forms</h6>

                        <div className="mt-2"></div>
                        {formTemplate.map((item, index) => (
                            <div className="created-forms-list bg-white my-1" key={index}  onClick={() => displaySelectedTemplate(item, index)} action>{item} </div>
                        ))}
                        <br />
                    </Col>
                    <Col className=" col-md-6 border-right section-two py-2 px-4 section" >
                        <h6 className="border-bottom pb-2" >{inUpdateView ? 'Created Form Template' : 'Create New Form'}</h6>
                        <div style={{ display: enableControls ? "block" : "none" }} ref={ref}>
                            <Form>
                                <Form.Row>
                                    <Col>
                                        <Form.Control placeholder="name....." value={name || ''} type="text" onChange={nameChange} readOnly={inUpdateView} />
                                    </Col>
                                    {!inUpdateView &&  <button type="button" onClick={saveForm} disabled={!name}>
                                        Save</button>
                                    }
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
                                            {!inUpdateView && <FontAwesomeIcon style={{ "marginTop": '6%', "cursor": "pointer" }} onClick={() => deleteFormElement(item, index)} icon={faTrashAlt} />}
                                        </Form.Row>
                                    </Form>
                                </div>)
                            })}
                        </div>
                    </Col>
                    <Col className="col-md-3 py-2 px-2 section section-three">
                        <h6>Form Fields</h6>
                        <div>
                            <ListGroup>
                                {formElements.map((item, index) => (
                                    <ListGroup.Item key={index} onClick={() => getSelected(item, index)}>{item}</ListGroup.Item>
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
