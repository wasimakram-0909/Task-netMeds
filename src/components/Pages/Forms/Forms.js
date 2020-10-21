import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, ListGroup, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { createRecord, updateRecords } from '../../../Redux/rootForm/rootFormActions';

function Forms(props) {
    const [formList, setFormList] = useState([]);
    var [formrender, setFormRender] = useState([]);
    const [selected, setSelected] = useState('');
    const [showButton, setShowButton] = useState(false);
    const dispatch = useDispatch();
    const forms = useSelector(state => state.form.forms);
    const [prevId, setPrevId] = useState(props.location?.state?.id);

    useEffect(() => {
        let tempArr = Object.keys(forms);
        setFormList(tempArr);
        if (prevId && prevId !== undefined) {
            let tempVal = prevId?.id?.split('_')[1];
            getSelectedForm(tempVal)
        } else if (prevId === undefined) {
            setPrevId('');
            setFormRender([]);
        }
    }, [forms])

    const CheckBox=(props)=> {
        return (
            <Form.Group controlId="formBasicCheckbox">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>
                <Form.Check type="checkbox" label="Check me out" checked={props?.data?.value} onChange={(e) => getValues(e.target.checked, props.index)} />
            </Form.Group>
        )
    }
    const TextArea=(props) =>{
        return (
            <Form.Group controlId="formBasicTextArea">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>
                <textarea className="form-control" rows="3" col="3" id="comment" defaultValue={props?.data?.value || ''} onChange={(e) => getValues(e.target.value, props.index)} ></textarea>
            </Form.Group>
        )
    }
    const DateArea=(props) =>{
        return (
            <Form.Group controlId="formBasicDate">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>
                <Form.Check type="date" defaultValue={props?.data?.value || ''} onChange={(e) => getValues(e.target.value, props.index)} />
            </Form.Group>
        )
    }

    
    const updateRecord=()=> {
        let tempObj = {};
        for (let i = 0; i < formrender.metaData.length; i++) {
            let field = formrender.metaData[i];
            tempObj[field['label']] = field['value'];
        }
        tempObj['templateType'] = selected;
        tempObj['id'] = prevId.id
        dispatch(updateRecords(tempObj));
        for (let i = 0; i < formrender.metaData.length; i++) {
            formrender.metaData[i]['value'] = '';
        }
        setPrevId('');
        setFormRender([]);
        setShowButton(false);
    }

    const getValues=(event, index)=> {
        let value = event
        formrender.metaData[index]['value'] = value
    }

    const EmailTag=(props)=> {
        return (
            <Form.Group controlId="formBasicEmail">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>
                <Form.Control type="email" placeholder="Enter email" defaultValue={props?.data?.value || ''} onChange={(e) => getValues(e.target.value, props.index)} />
                <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
            </Form.Group>
        )
    }
    const TextTag=(props)=> {
        return (
            <Form.Group controlId="formBasicEmail">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>
                <Form.Control type="text" placeholder="Enter Text" defaultValue={props?.data?.value || ''} onChange={(e) => getValues(e.target.value, props.index)} />
            </Form.Group>
        )
    }
    const getSelectedForm = (value) =>{
        setShowButton(true);
        let temp = JSON.parse(JSON.stringify(forms[value]));
        if (prevId && temp && temp['metaData'].length) {
            for (let k = 0; k < temp['metaData'].length; k++) {
                let field = temp['metaData'][k]
                field['value'] = prevId[field['label']]
            }
        }
        setSelected(value);
        setFormRender(temp);
    }

    const saveRecord =()=> {
        let tempRecord = {};
        let uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
        for (let i = 0; i < formrender.metaData.length; i++) {
            let field = formrender.metaData[i];
            tempRecord[field['label']] = field['value'];
        }
        tempRecord['templateType'] = selected;
        tempRecord['id'] = uniqueId + '_' + selected;
        dispatch(createRecord(tempRecord));
        for (let i = 0; i < formrender.metaData.length; i++) {
            formrender.metaData[i]['value'] = '';
        }
        setFormRender([]);
        setShowButton(false);
    }

    const NumberTag=(props)=> {
        return (
            <Form.Group controlId="formBasicEmail">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>
                <Form.Control type="number" placeholder="12345...." defaultValue={props?.data?.value || ''} onChange={(e) => getValues(e.target.value, props.index)} />
            </Form.Group>
        )
    }
    

    return (
        <>
            <div>
                <Row className="m-0">
                    <Col  className=" col-md-3 section left-section py-2 px-4" >
                        <h6 > List Forms</h6>
                        {formList.map((item, index) => (
                            <ListGroup.Item key={index}  onClick={() => getSelectedForm(item)} action>{item}</ListGroup.Item>
                        ))}
                    </Col>
                    <Col  className="col-md-9 py-2 px-4 section section-two ">
                        <h6 className="border-bottom pb-2">Selected Form</h6>
                        {showButton && <div className="float-right">
                        <div className="d-flex justify-content-end">
                            <button type="button" onClick={prevId ? updateRecord : saveRecord}>
                               {prevId ? 'Update Record' : 'Create Record'}
                            </button>
                        </div>
                           
                        </div>}
                        {formrender && formrender?.metaData?.length && formrender?.metaData.map((item, index) => (
                            <div key={index}>
                                <Form>
                                    {item.type === 'email' && <EmailTag data={item} index={index} />}
                                    {item.type === 'text' && <TextTag data={item} index={index} />}
                                    {item.type === 'number' && <NumberTag data={item} index={index} />}
                                    {item.type === 'checkbox' && <CheckBox data={item} index={index} />}
                                    {item.type === 'textArea' && <TextArea data={item} index={index} />}
                                    {item.type === 'date' && <DateArea data={item} index={index} />}
                                </Form>
                            </div>
                        ))}
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Forms
