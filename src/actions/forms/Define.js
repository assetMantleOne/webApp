import React, {useState} from "react";
import {Form, Button, Modal} from "react-bootstrap";
import Helpers from "../../utilities/Helper"
import InputField from "../../components/inputField"
import {useTranslation} from "react-i18next";
import { pollTxHash } from '../../utilities/Helper'
import config from "../../constants/config.json"

const Define = (props) => {
    const Helper = new Helpers();
    const url = process.env.REACT_APP_ASSET_MANTLE_API;
    const [dataTypeOption, setDataTypeOption] = useState("S|");
    const [typeOption, setTypeOption] = useState("identity");
    const [mutableStyle, setMutableStyle] = useState("ERC20");
    const [response, setResponse] = useState({});
    const [mutableProperties, setMutableProperties] = useState([]);
    const [mutableMetaProperties, setMutableMetaProperties] = useState([]);
    const [immutableProperties, setImmutableProperties] = useState([]);
    const [immutableMetaProperties, setImmutableMetaProperties] = useState([]);
    const [inputValues, setInputValues] = useState([]);
    const {t} = useTranslation();

    const handleChange = evt => {
        const newValue = evt.target.value;
        setInputValues({...inputValues, [evt.target.name]: newValue});
    }

    const handleChangeType = evt => {
        setTypeOption(evt.target.value);
    }
    const handleChangeStyle = evt => {
        setMutableStyle(evt.target.value);
    }

    const handleSelectChange = evt => {
        setDataTypeOption(evt.target.value);
        const newValue = evt.target.value;
        setInputValues({...inputValues, [evt.target.name]: newValue});

    }
    const handleSubmit = (evt) => {
        evt.preventDefault();
        let assetSpecificMutables = '';
        if (typeOption === 'asset') {
            assetSpecificMutables = 'burn:H|,lock:H|';
        }
        let orderSpecificMutables = '';
        if (typeOption === 'order') {
            orderSpecificMutables = 'exchangeRate:D|,expiry:H|,makerOwnableSplit:D|,takerID:I|';
        }
        const FromId = evt.target.FromId.value;
        let staticImmutableMeta = "";
        const ImmutableDescription = evt.target.ImmutableDescription.value;
        const ImmutableIdentifier = evt.target.ImmutableIdentifier.value;
        const ImmutableClassifier = evt.target.ImmutableClassifier.value;
        let staticImmutables = `style:S|${mutableStyle},type:S|${typeOption}`;
        staticImmutableMeta = `classifier:S|${ImmutableClassifier},identifier:S|${ImmutableIdentifier},description:S|${ImmutableDescription}`
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        let mutablePropertyValue = ""
        let mutableMetaPropertyValue = ""
        let immutablePropertyValue = ""
        let immutableMetaPropertyValue = ""
        mutableProperties.map((mutableProperty, idx) => {
            const checkError = Helper.DataTypeValidation(idx, inputValues, 'Mutable');
            Helper.showHideDataTypeError(checkError, `Mutable${idx}`);
        })
        mutablePropertyValue = Helper.MutablePropertyValues(mutableProperties, inputValues);
        mutableMetaProperties.map((mutableMetaProperty, idx) => {
            const checkError = Helper.DataTypeValidation(idx, inputValues, 'MutableMeta');
            Helper.showHideDataTypeError(checkError, `MutableMeta${idx}`);
        })
        mutableMetaPropertyValue = Helper.MutableMetaPropertyValues(mutableMetaProperties, inputValues);
        immutableProperties.map((immutableMetaProperty, idx) => {
            const checkError = Helper.DataTypeValidation(idx, inputValues, 'Immutable');
            Helper.showHideDataTypeError(checkError, `Immutable${idx}`);
        })
        immutablePropertyValue = Helper.ImmutablePropertyValues(immutableProperties, inputValues);
        immutableMetaProperties.map((immutableMetaProperty, idx) => {
            const checkError = Helper.DataTypeValidation(idx, inputValues, 'ImmutableMeta');
            Helper.showHideDataTypeError(checkError, `ImmutableMeta${idx}`);
        })
        immutableMetaPropertyValue = Helper.ImmutableMetaPropertyValues(immutableMetaProperties, inputValues);
        if (typeOption === 'asset') {
            if (mutableMetaPropertyValue) {
                mutableMetaPropertyValue = mutableMetaPropertyValue + ',' + assetSpecificMutables;
            } else {
                mutableMetaPropertyValue = assetSpecificMutables;
            }
        }
        if (typeOption === 'order') {
            if (mutableMetaPropertyValue) {
                mutableMetaPropertyValue = mutableMetaPropertyValue + ',' + orderSpecificMutables;
            } else {
                mutableMetaPropertyValue = orderSpecificMutables;
            }
        }
        if (immutablePropertyValue) {
            immutablePropertyValue = immutablePropertyValue + ',' + staticImmutables;
        } else {
            immutablePropertyValue = staticImmutables;
        }
        if (immutableMetaPropertyValue) {
            immutableMetaPropertyValue = immutableMetaPropertyValue + ',' + staticImmutableMeta;
        } else {
            immutableMetaPropertyValue = staticImmutableMeta;
        }
        if (mutablePropertyValue !== "") {
            if (mutableMetaPropertyValue !== "") {
                const defineIdentityResult = props.ActionName.define(userAddress, "test", userTypeToken, FromId, mutablePropertyValue, immutablePropertyValue, mutableMetaPropertyValue, immutableMetaPropertyValue, config.feesAmount, config.feesToken, 200000, config.mode)
                defineIdentityResult.then(function (item) {
                    const data = JSON.parse(JSON.stringify(item));
                    if(data.txhash){
                        let queryHashResponse =  pollTxHash(url, data.txhash);
                        queryHashResponse.then(function (queryItem) {
                            const queryData = JSON.parse(queryItem);
                            setResponse(queryData)
                            console.log(queryData, "queryHashResponse")
                        })
                    }
                })
            } else {
                console.log("add Mutable Meta property")
            }
        } else {
            console.log("add mutable property")
        }

    }

    const handleMutableProperties = () => {
        setMutableProperties(mutableProperties => mutableProperties.concat([{name: ''}]));
    }
    const handleMutableMetaProperties = () => {
        setMutableMetaProperties(mutableMetaProperties => mutableMetaProperties.concat([{name: ''}]));
    }

    const handleImmutableProperties = () => {
        setImmutableProperties(immutableProperties => immutableProperties.concat([{name: ''}]));
    }
    const handleImmutableMetaProperties = () => {
        setImmutableMetaProperties(immutableMetaProperties => immutableMetaProperties.concat([{name: ''}]));
    }
    const handleRemoveMutableProperties = (idx) => () => {
        setMutableProperties(mutableProperties => mutableProperties.filter((s, sidx) => idx !== sidx));
    }

    const handleRemoveMutableMetaProperties = (idx) => () => {
        setMutableMetaProperties(mutableMetaProperties => mutableMetaProperties.filter((s, sidx) => idx !== sidx));
    }
    const handleRemoveImmutableProperties = (idx) => () => {
        setImmutableProperties(immutableProperties => immutableProperties.filter((s, sidx) => idx !== sidx));
    }
    const handleRemoveImmutableMetaProperties = (idx) => () => {
        setImmutableMetaProperties(immutableMetaProperties => immutableMetaProperties.filter((s, sidx) => idx !== sidx));
    }
    return (
        <div className="accountInfo">
            <Modal.Header closeButton>
                {props.FormName}
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>{t("FROM_ID")}</Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="FromId"
                            required={true}
                            placeholder="FromId"
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Immutable style:S| </Form.Label>
                        <Form.Control as="select" onChange={handleChangeStyle} name="ImmutableStyle"
                                      required={true}>
                            <option value="ERC20"> ERC20</option>
                            <option value="ERC721">ERC721</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Immutable type:S| </Form.Label>
                        <Form.Control as="select" name="type"
                                      required={true} onChange={handleChangeType}>
                            <option value="identitiy">{t("IDENTITY")}</option>
                            <option value="asset">{t("ASSET")}</option>
                            <option value="order">{t("ORDER")}</option>
                        </Form.Control>
                    </Form.Group>
                    <InputField
                        type="text"
                        className=""
                        name="ImmutableClassifier"
                        required={false}
                        placeholder="Classifier"
                        label="Immutable classifier:S|"
                        disabled={false}
                    />
                    <InputField
                        type="text"
                        className=""
                        name="ImmutableIdentifier"
                        required={false}
                        placeholder="identifier"
                        label="Immutable identifier:S|"
                        disabled={false}
                    />
                    <InputField
                        type="text"
                        className=""
                        name="ImmutableDescription"
                        required={false}
                        placeholder="description"
                        label="Immutable description:S|"
                        disabled={false}
                    />
                    {typeOption === 'asset'
                        ?
                        <>
                            <InputField
                                type="text"
                                className=""
                                name="MutableBurn"
                                required={true}
                                value={-1}
                                placeholder="Trait Value"
                                label="Mutable burn:H|"
                                disabled={true}
                            />
                            <InputField
                                type="text"
                                className=""
                                name="MutableLock"
                                required={true}
                                value={-1}
                                placeholder="Trait Value"
                                label="Mutable lock:H|"
                                disabled={true}
                            />
                        </>
                        : ""
                    }
                    {typeOption === 'order'
                        ?
                        <>
                            <InputField
                                type="text"
                                className=""
                                name="MutableexchangeRate"
                                required={true}
                                placeholder="exchangeRate"
                                label="Mutable exchangeRate:D|"
                                value={-1}
                                disabled={true}
                            />
                            <InputField
                                type="text"
                                className=""
                                name="Mutableexpiry"
                                required={true}
                                placeholder="expiry"
                                label="Mutable expiry:H|"
                                value={-1}
                                disabled={true}
                            />
                            <InputField
                                type="text"
                                className=""
                                name="MutablemakerOwnableSplit"
                                required={true}
                                placeholder="makerOwnableSplit"
                                label="Mutable makerOwnableSplit:D|"
                                value={-1}
                                disabled={true}
                            />
                            <InputField
                                type="text"
                                className=""
                                name="MutabletakerID"
                                required={true}
                                placeholder="takerID"
                                label="takerID:I|"
                                value={-1}
                                disabled={true}
                            />
                        </>
                        : ""
                    }
                    {mutableProperties.map((shareholder, idx) => (
                        <div key={idx}>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>{t("DATA_TYPE")}</Form.Label>
                                <Form.Control as="select" value={dataTypeOption} name={`MutableDataType${idx + 1}`}
                                              onChange={handleSelectChange}
                                              required={true}>
                                    <option value="S|">{t("STRING")}</option>
                                    <option value="D|">{t("DECIMAL")}</option>
                                    <option value="H|">{t("HEIGHT")}</option>
                                    <option value="I|">{t("ID_TYPE")}</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>{t("DATA_NAME")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`MutableDataName${idx + 1}`}
                                    required={true}
                                    placeholder="Data Name"
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>{t("DATA_VALUE")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`MutableDataValue${idx + 1}`}
                                    required={false}
                                    placeholder="Data Value"
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Text id={`Mutable${idx}`} className="text-muted none">
                                {t("DATA_TYPE_ERROR")}
                            </Form.Text>

                            <button type="button" onClick={handleRemoveMutableProperties(idx)} className="small">-
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleMutableProperties} className="small">Add Mutable</button>
                    {mutableMetaProperties.map((mutableMetaProperty, idx) => (
                        <div key={idx}>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>{t("DATA_TYPE")}</Form.Label>
                                <Form.Control as="select" name={`MutableMetaDataType${idx + 1}`}
                                              onChange={handleChange}>
                                    <option value="S|">{t("STRING")}</option>
                                    <option value="D|">{t("DECIMAL")}</option>
                                    <option value="H|">{t("HEIGHT")}</option>
                                    <option value="I|">{t("ID_TYPE")}</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>{t("DATA_NAME")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`MutableMetaDataName${idx + 1}`}
                                    required={true}
                                    placeholder="Data Name"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>{t("DATA_VALUE")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`MutableMetaDataValue${idx + 1}`}
                                    required={false}
                                    placeholder="Data Value"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Text id={`MutableMeta${idx}`} className="text-muted none">
                                {t("DATA_TYPE_ERROR")}
                            </Form.Text>
                            <button type="button" onClick={handleRemoveMutableMetaProperties(idx)} className="small">-
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleMutableMetaProperties} className="small">Add mutable Meta
                    </button>
                    {immutableProperties.map((immutableProperty, idx) => (
                        <div key={idx}>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>{t("DATA_TYPE")}</Form.Label>
                                <Form.Control as="select" name={`ImmutableDataType${idx + 1}`} onChange={handleChange}>
                                    <option value="S|">{t("STRING")}</option>
                                    <option value="D|">{t("DECIMAL")}</option>
                                    <option value="H|">{t("HEIGHT")}</option>
                                    <option value="I|">{t("ID_TYPE")}</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>{t("DATA_NAME")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`ImmutableDataName${idx + 1}`}
                                    required={true}
                                    placeholder="Data Name"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>{t("DATA_VALUE")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`ImmutableDataValue${idx + 1}`}
                                    required={false}
                                    placeholder="Data Value"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Text id={`Immutable${idx}`} className="text-muted none">
                                {t("DATA_TYPE_ERROR")}
                            </Form.Text>
                            <button type="button" onClick={handleRemoveImmutableProperties(idx)} className="small">-
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleImmutableProperties} className="small">Add Immutable</button>
                    {immutableMetaProperties.map((immutableMetaProperty, idx) => (
                        <div key={idx}>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>{t("DATA_TYPE")}</Form.Label>
                                <Form.Control as="select" name={`ImmutableMetaDataType${idx + 1}`}
                                              onChange={handleChange}>
                                    <option value="S|">{t("STRING")}</option>
                                    <option value="D|">{t("DECIMAL")}</option>
                                    <option value="H|">{t("HEIGHT")}</option>
                                    <option value="I|">{t("ID_TYPE")}</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>{t("DATA_NAME")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`ImmutableMetaDataName${idx + 1}`}
                                    required={true}
                                    placeholder="Data Name"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>{t("DATA_VALUE")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`ImmutableMetaDataValue${idx + 1}`}
                                    required={false}
                                    placeholder="Data Value"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Text id={`ImmutableMeta${idx}`} className="text-muted none">
                                {t("DATA_TYPE_ERROR")}
                            </Form.Text>
                            <button type="button" onClick={handleRemoveImmutableMetaProperties(idx)}
                                    className="small">-
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleImmutableMetaProperties} className="small">Add Immutable Meta
                    </button>
                    <div className="submitButtonSection">
                        <Button variant="primary" type="submit">
                            {t("SUBMIT")}
                        </Button>
                    </div>
                    {response.code ?
                        <p> {response.raw_log}</p>
                        :
                        <p> {response.txhash}</p>
                    }
                </form>
            </Modal.Body>
        </div>
    );
};

export default Define;
