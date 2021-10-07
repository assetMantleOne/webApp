import React, {useState, useEffect} from 'react';
import {Form, Button, Modal} from 'react-bootstrap';
import InputField from '../../../components/inputField';
import {useTranslation} from 'react-i18next';
import Loader from '../../../components/loader';
import CommonKeystore from '../login/CommonKeystore';

const Nub = (props) => {
    const [totalDefineObject, setTotalDefineObject] = useState({});
    const [externalComponent, setExternalComponent] = useState('');
    const [testIdentityId, settestIdentityId] = useState('');
    const [loader, setLoader] = useState(false);
    const [showIdentity, setShowIdentity] = useState(true);
    const {t} = useTranslation();
    useEffect(() => {
        let testIdentityId = localStorage.getItem('identityId');
        settestIdentityId(testIdentityId);

    }, []);
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoader(true);
        const nubId = event.target.nubID.value;
        let totalData = {
            nubId: nubId,
        };
        setTotalDefineObject(totalData);
        setExternalComponent('Keystore');
        setShowIdentity(false);
        setLoader(false);
    };

    const handleClose = () => {
        setShowIdentity(false);
        props.setExternalComponent('');
    };

    return (
        <div>

            <Modal
                show={showIdentity}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <div>
                    {loader ?
                        <Loader/>
                        : ''
                    }
                </div>
                <Modal.Header closeButton>
                    {t('NUB')}
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <InputField
                            type="text"
                            className=""
                            name="nubID"
                            value={testIdentityId}
                            required={true}
                            placeholder="nubID"
                            label="nubID"
                            disabled={false}
                        />
                        <div className="submitButtonSection">
                            <Button variant="primary" type="submit">
                                {t('SUBMIT')}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <div>
                {
                    externalComponent === 'Keystore' ?
                        <CommonKeystore
                            setExternalComponent={setExternalComponent}
                            totalDefineObject={totalDefineObject}
                            TransactionName={'nubid'}
                            handleClose={handleClose}
                        /> :
                        null
                }
            </div>
        </div>
    );
};

export default Nub;
