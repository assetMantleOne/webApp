import React, {useState, useEffect} from "react";
import deputizeJS from "persistencejs/transaction/maintainers/deputize";
import {Form, Button, Modal} from "react-bootstrap";
import ClassificationsQueryJS from "persistencejs/transaction/classification/query";

const deputizeMaintainer = new deputizeJS(process.env.REACT_APP_ASSET_MANTLE_API)

const classificationsQuery = new ClassificationsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const Deputize = (props) => {
    const [show, setShow] = useState(false);
    const [checkboxMutableNamesList, setCheckboxMutableNamesList] = useState([]);
    const [mutableList, setMutableList] = useState([]);
    const [externalComponent, setExternalComponent] = useState("");
    const handleClose = () => {
        setShow(false);
    };
    useEffect(() => {
        const classificationId = props.maintainerData.value.id.value.classificationID.value.idString
        const classificationResponse = classificationsQuery.queryClassificationWithID(classificationId)

        classificationResponse.then(function (item) {
            const data = JSON.parse(item);
            const mutablePropertyList = data.result.value.classifications.value.list[0].value.mutableTraits.value.properties.value.propertyList;
            setMutableList(mutablePropertyList)
        })
    }, [])

    const handleCheckMutableChange = evt => {
        const checkedValue = evt.target.checked;
        const name = evt.target.value
        if (checkedValue) {
            const checkboxNames = evt.target.value;
            setCheckboxMutableNamesList((checkboxMutableNamesList) => [...checkboxMutableNamesList, checkboxNames]);
        } else {
            if (checkboxMutableNamesList.includes(name)) {
                setCheckboxMutableNamesList(checkboxMutableNamesList.filter(item => item !== name));
            }
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const classificationId = props.maintainerData.value.id.value.classificationID.value.idString
        const identityId = props.maintainerData.value.id.value.identityID.value.idString
        const addMaintainer = document.getElementById("addMaintainer").checked
        const mutateMaintainer = document.getElementById("mutateMaintainer").checked
        const removeMaintainer = document.getElementById("removeMaintainer").checked
        let maintainedTraits = ""
        checkboxMutableNamesList.forEach((checkboxMutableName) => {
            console.log(checkboxMutableName, "checkboxMutableName")
            maintainedTraits = maintainedTraits + checkboxMutableName;
        })
        const ToId = event.target.ToId.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const DeputizeResponse = deputizeMaintainer.deputize(userAddress, "test", userTypeToken, identityId, classificationId, ToId, maintainedTraits, addMaintainer, removeMaintainer, mutateMaintainer, 25, "stake", 200000, "block");
        console.log(DeputizeResponse, "result DeputizeResponse")
    };
    return (
        <div className="accountInfo">

            <Modal.Header closeButton>
                Deputize
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>FromId</Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="ToId"
                            required={true}
                            placeholder="ToId"
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Can add"
                                    name="addMaintainer"
                                    id="addMaintainer"
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Can mutate"
                                    name="mutateMaintainer"
                                    id="mutateMaintainer"
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Can remove"
                                    name="removeMaintainer"
                                    id="removeMaintainer"
                        />
                    </Form.Group>
                    <div>
                        <p>Add maintainable Traits</p>
                        {mutableList !== null ?
                            mutableList.map((mutable, index) => {
                                const mutableType = mutable.value.fact.value.type;
                                const mutableName = mutable.value.id.value.idString;
                                return (
                                    <div key={index}>
                                        <Form.Group controlId="formBasicCheckbox">
                                            <Form.Check type="checkbox" label={mutableName}
                                                        name={`${mutableName}:${mutableType}|${index}`}
                                                        value={`${mutableName}:${mutableType}|`}
                                                        onClick={handleCheckMutableChange}
                                            />
                                        </Form.Group>
                                    </div>
                                )
                            })
                            : ""
                        }
                    </div>
                    <div className="submitButtonSection">
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </div>
    );
};

export default Deputize;
