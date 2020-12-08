import React, {useState, useCallback} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import keyUtils from "persistencejs/utilities/keys";
import DownloadLink from "react-download-link";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";

const SignUp = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [jsonName, setJsonName] = useState({});
    const [showEncrypt, setShowEncrypt] = useState(false);
    const [mnemonic, setMnemonic] = useState("");
    const [formName, setFormName] = useState("");
    const [showDownload, setShowDownload] = useState(false);
    const handleClose = () => {
        setShow(false)
        history.push('/');
    };
    const handleCloseEncrypt = () => {
        setShowEncrypt(false)
        history.push('/');
    };

    const handleSubmit = e => {
        e.preventDefault()
        setShowEncrypt(true)
        setShowDownload(true)
        const password = document.getElementById("password").value
        const error = keyUtils.createRandomWallet(password)
        if (error.error != null) {
            return (<div>ERROR!!</div>)
        }

        const create = keyUtils.createStore(error.mnemonic, password)
        if (create.error != null) {
            return (<div>ERROR!!</div>)
        }
        const jsonContent = JSON.stringify(create.Response);
        setJsonName(jsonContent)
        setMnemonic(error.mnemonic)
        localStorage.setItem("address", error.address)
        localStorage.setItem("mnemonic", error.mnemonic)
    }

    const handleEncrypt = (name) => {
        setShow(false)
        setFormName(name)
        setShowEncrypt(true)
    }

    return (
        <div className="accountInfo">
            <Modal show={show} onHide={handleClose} className="signup-section" centered>
            <Modal.Header closeButton>
                {t("SIGNING_UP")}
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <p>({t("SIGNUP_NOTE")})</p>
                    <div>
                        <Button
                            variant="primary"
                            className="button-signup-mnemonic button-signup"
                            onClick={() => handleEncrypt("SignUp with PrivateKey")}
                        >
                            {t("MNEMONIC")}/{t("PRIVATE_KEY")}
                        </Button>
                        <div>
                        </div>
                        <Button
                            variant="primary"
                            className="button-signup button-signup-ledger"
                        >
                            {t("LEDGER_STORE")}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                    <Form.Check custom type="checkbox" label="Accept Terms&Conditions"
                                name="removeMaintainer"
                                id="removeMaintainer"
                    />
            </Modal.Footer>
            </Modal>
            <Modal
                show={showEncrypt}
                onHide={handleCloseEncrypt}
                centered
            >
                <Modal.Header closeButton>
                    {formName}
                </Modal.Header>
                <Modal.Body>
                    {!showDownload ?
                        <Form onSubmit={handleSubmit}>
                            <Form.Label>{t("ENCRYPT_KEY_STORE")}</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                id="password"
                                placeholder="password"
                                required={true}
                            />
                            <div className="submitButtonSection">
                            <Button
                                variant="primary"
                                type="submit"
                            >
                                {t("NEXT")}
                            </Button>
                            </div>
                        </Form>
                        : ""
                    }
                    {showDownload ?
                        <div>
                            <p><b>{t("SAVE_MNEMONIC")}:</b> {mnemonic}</p>
                            <DownloadLink
                                label="Download Key File for future use"
                                filename="key.json"
                                exportFile={() => `${jsonName}`}
                            />
                            <br/>
                            {t("DOWNLOAD_KEY")}
                            <br/>
                            <Button
                                variant="primary"
                                onClick={handleClose}
                            >
                                {t("DONE")}
                            </Button>
                        </div>
                        :
                        ""
                    }
                </Modal.Body>
            </Modal>

        </div>
    );
}
export default SignUp