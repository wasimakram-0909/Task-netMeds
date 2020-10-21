import React, { useEffect, useState } from 'react'
import { Button, Col, Form, ListGroup, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { deleteRecords } from '../../../Redux/rootForm/rootFormActions';

function Records() {
    const listCss = { cursor: 'pointer', listStyle: 'none', margin: '3px', padding: '10px', border: '1px dashed #ddd' }
    const [formList, setFormList] = useState([]);
    const mainForms = useSelector(state => state.form);
    const [formrender, setFormRender] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState({})
    const [showRecord, setShowRecord] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        let tempArr = mainForms?.records
        setFormList(tempArr);
    }, [mainForms])

    const NumberTag=(props) => {
        return (
            <Form.Group controlId="formBasicEmail">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>
                <Form.Control type="number" placeholder="12345...." value={props?.data?.value} readOnly />
            </Form.Group>
        )
    }
    const CheckBox=(props) => {
        return (
            <Form.Group controlId="formBasicCheckbox">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>
                <Form.Check type="checkbox" label="Check me out" checked={props?.data?.value} disabled />
            </Form.Group>
        )
    }
    const TextArea=(props) => {
        return (
            <Form.Group controlId="formBasicTextArea">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>
                <textarea className="form-control" rows="3" col="3" id="comment" value={props?.data?.value} readOnly></textarea>
            </Form.Group>
        )
    }
    const DateArea=(props) => {
        return (
            <Form.Group controlId="formBasicDate">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>
                <Form.Check type="date" value={props?.data?.value} disabled />
            </Form.Group>
        )
    }

    const getSelectedForm=(value, index)  =>{
        let tempVal = value?.id.split('_')[1];
        let tempForm = JSON.parse(JSON.stringify(mainForms.forms[tempVal]));
        for (let k = 0; k < tempForm['metaData'].length; k++) {
            let field = tempForm['metaData'][k]
            field['value'] = value[field['label']]
        }
        setSelectedRecord(value);
        setFormRender(tempForm);
        setShowRecord(true);
    }


    const deleteRecord=()  =>{
        dispatch(deleteRecords(selectedRecord));
        let tempArr = mainForms?.records
        setFormList(tempArr);
        setShowRecord(false);
        setFormRender([]);
    }

    const EmailTag=(props)  =>{
        return (
            <Form.Group controlId="formBasicEmail">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={props?.data?.value} readOnly />
                <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
            </Form.Group>
        )
    }
    const TextTag=(props) => {
        return (
            <Form.Group controlId="formBasicEmail">
                <Form.Label>{props?.data?.displayLabel}</Form.Label>
                <Form.Control type="text" placeholder="Enter Text" value={props?.data?.value} readOnly />
            </Form.Group>
        )
    }
    

    return (
        <>
            <div>
                <Row className="m-0">
                    <Col className=" col-md-3 section left-section py-2 px-4" >
                        <h6>Records List</h6>
                        
                        {formList?.length ? <>{formList.map((item, index) => (
                            <ListGroup.Item key={index} style={listCss} onClick={() => getSelectedForm(item, index)} action>{item?.id}</ListGroup.Item>
                        ))}</>:""
                        }
                    </Col>
                    <Col className="col-md-9 py-2 px-4 section section-two ">
                        <h6 className="border-bottom pb-2">Record</h6>
                        <div>
                            {(formList?.length && showRecord) ? <div className="float-right">
                                <Link to={{ pathname: '/forms', state: { id: selectedRecord } }}>
                                    <span>
                                        <button type="button">
                                                Edit
                                        </button>
                                    </span>
                                </Link>
                                {' '}
                                <span>
                                    
                                    <button type="button" onClick={deleteRecord}>
                                             Delete 
                                        </button>
                                </span>
                            </div>:""}
                        </div>
                        {formrender && formrender?.metaData?.length && formrender?.metaData.map((item, index) => (
                            <div key={index}>
                                <div className="float-right">
                                </div>
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

export default Records
