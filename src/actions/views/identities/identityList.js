import React, {useState, useEffect} from "react";
import identitiesQueryJS from "persistencejs/transaction/identity/query";
import metasQueryJS from "persistencejs/transaction/meta/query";
import {Button} from "react-bootstrap";
import {Provision, UnProvision} from "../../forms/identities";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader"
import Copy from "../../../components/copy"
import config from "../../../constants/config.json"
import GetProperty from "../../../utilities/Helpers/getProperty";
import FilterHelpers from "../../../utilities/Helpers/filter";
import GetMeta from "../../../utilities/Helpers/getMeta";
import GetID from "../../../utilities/Helpers/getID";

const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesQuery = new identitiesQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const IdentityList = React.memo((props) => {
    const PropertyHelper = new GetProperty();
    const FilterHelper = new FilterHelpers();
    const GetMetaHelper = new GetMeta();
    const GetIDHelper = new GetID();
    const {t} = useTranslation();
    const [loader, setLoader] = useState(true)
    const [externalComponent, setExternalComponent] = useState("");
    const [identityId, setIdentityId] = useState("");
    const [identity, setIdentity] = useState([]);
    const [filteredIdentitiesList, setFilteredIdentitiesList] = useState([]);
    const userAddress = localStorage.getItem('address');
    useEffect(() => {
        const fetchToIdentities = () => {
            const identities = identitiesQuery.queryIdentityWithID("all")
            if (identities) {
                identities.then(function (item) {
                    const data = JSON.parse(item);
                    const dataList = data.result.value.identities.value.list;
                    if (dataList) {
                        const filterIdentities = FilterHelper.FilterIdentitiesByProvisionedAddress(dataList, userAddress);
                        if (filterIdentities.length) {
                            setFilteredIdentitiesList(filterIdentities);
                            filterIdentities.map((identity, index) => {
                                let immutableProperties = "";
                                let mutableProperties = "";
                                if (identity.value.immutables.value.properties.value.propertyList !== null) {
                                    immutableProperties = PropertyHelper.ParseProperties(identity.value.immutables.value.properties.value.propertyList);
                                }
                                if (identity.value.mutables.value.properties.value.propertyList !== null) {
                                    mutableProperties = PropertyHelper.ParseProperties(identity.value.mutables.value.properties.value.propertyList);
                                }
                                let immutableKeys = Object.keys(immutableProperties);
                                let mutableKeys = Object.keys(mutableProperties);
                                GetMetaHelper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_identityList', index, 'identityUrlId');
                                GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_identityList', index);
                                setLoader(false)
                            })
                        } else {
                            setLoader(false)
                        }
                    } else {
                        setLoader(false)
                    }
                })
            } else {
                setLoader(false)
            }
        }
        fetchToIdentities();
    }, []);

    const handleModalData = (formName, identityId, identity) => {
        setExternalComponent(formName)
        setIdentity(identity);
        setIdentityId(identityId)
    }

    return (
        <div className="list-container">
            {loader ?
                <Loader/>
                : ""
            }
            <div className="row card-deck">
                {filteredIdentitiesList.length ?
                    filteredIdentitiesList.map((identity, index) => {
                        let immutableProperties = "";
                        let mutableProperties = "";
                        let provisionedAddressList = "";
                        let unProvisionedAddressList = "";
                        const identityId = GetIDHelper.GetIdentityID(identity)
                        if (identity.value.immutables.value.properties.value.propertyList !== null) {
                            immutableProperties = PropertyHelper.ParseProperties(identity.value.immutables.value.properties.value.propertyList);
                        }
                        if (identity.value.mutables.value.properties.value.propertyList !== null) {
                            mutableProperties = PropertyHelper.ParseProperties(identity.value.mutables.value.properties.value.propertyList);
                        }
                        if (identity.value.provisionedAddressList !== null) {
                            provisionedAddressList = identity.value.provisionedAddressList;
                        }
                        if (identity.value.provisionedAddressList !== null) {
                            unProvisionedAddressList = identity.value.unprovisionedAddressList;
                        }
                        let immutableKeys = Object.keys(immutableProperties);
                        let mutableKeys = Object.keys(mutableProperties);
                        return (
                            <div className="col-xl-4 col-lg-6 col-md-6  col-sm-12" key={index}>
                                <div className="card">
                                    <div id={"imagUri" + identityId}>
                                        <div id={"image" + identityId} className="dummy-image">

                                        </div>
                                    </div>
                                    <div>
                                        <Button variant="secondary" size="sm"
                                                onClick={() => handleModalData("Provision", identityId)}>{t("PROVISION")}</Button>
                                        <Button variant="secondary" size="sm"
                                                onClick={() => handleModalData("UnProvision", identityId, identity)}>{t("UN_PROVISION")}</Button>
                                    </div>
                                    <div className="list-item">
                                        <p className="list-item-label">{t("IDENTITY_ID")}</p>
                                        <div className="list-item-value id-section">
                                            <p className="id-string" title={identityId}>: {identityId}</p>
                                            <Copy
                                                id={identityId}/>
                                        </div>
                                    </div>

                                    <p className="sub-title">{t("IMMUTABLES")}</p>
                                    {immutableKeys !== null ?
                                        immutableKeys.map((keyName, index1) => {
                                            if (immutableProperties[keyName] !== "") {
                                                if (keyName === config.URI) {
                                                    let imageElement = document.getElementById("image" + identityId)
                                                    if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                                        let divd = document.createElement('div');
                                                        divd.id = `identityUrlId` + index + `${index1}`
                                                        divd.className = "assetImage"
                                                        document.getElementById("imagUri" + identityId).replaceChild(divd, imageElement);
                                                    }
                                                }  else {
                                                    return (<div key={index + keyName} className="list-item"><p
                                                        className="list-item-label">{keyName} </p>: <p
                                                        id={`immutable_identityList` + index + `${index1}`}
                                                        className="list-item-value"></p></div>)
                                                }
                                            }else {
                                                return (
                                                    <div key={index + keyName} className="list-item"><p className="list-item-label">{keyName} </p>: <p className="list-item-hash-value">{immutableProperties[keyName]}</p></div>)
                                            }
                                        })
                                        : ""
                                    }
                                    <p className="sub-title">{t("MUTABLES")}</p>
                                    {mutableKeys !== null ?
                                        mutableKeys.map((keyName, index1) => {
                                            if (mutableProperties[keyName] !== "") {
                                                return (<div key={index + keyName} className="list-item"><p className="list-item-label">{keyName} </p>: <p
                                                    id={`mutable_identityList` + index + `${index1}`}  className="list-item-value"></p></div>)
                                            } else {
                                                return (
                                                    <div key={index + keyName} className="list-item"><p>{keyName} </p>: <p className="list-item-hash-value">{mutableProperties[keyName]}</p></div>)
                                            }
                                        })
                                        : ""
                                    }
                                    <p className="sub-title">{t("PROVISION_ADDRESS_LIST")}</p>
                                    {provisionedAddressList !== null && provisionedAddressList !== "" ?
                                        provisionedAddressList.map((provisionedAddress, provisionedAddressKey) => {
                                            return (<p key={provisionedAddressKey} className="provision-address" title={provisionedAddress}>{provisionedAddress}</p>)
                                        })
                                        : <p>--</p>
                                    }
                                    <p className="sub-title">{t("UN_PROVISION_ADDRESS_LIST")}</p>
                                    {unProvisionedAddressList !== null && unProvisionedAddressList !==  "" ?
                                        unProvisionedAddressList.map((unprovisionedAddress, unprovisionedAddressKey) => {
                                            return (<p key={unprovisionedAddressKey}  className="provision-address" title={unprovisionedAddress}>{unprovisionedAddress}</p>)
                                        })
                                        : <p>--</p>
                                    }
                                </div>
                            </div>
                        )
                    })
                    : <p className="empty-list">{t("IDENTITIES_NOT_FOUND")}</p>}
            </div>
            <div>
                {externalComponent === 'Provision' ?
                    <Provision setExternalComponent={setExternalComponent} identityId={identityId}/> :
                    null
                }
                {externalComponent === 'UnProvision' ?
                    <UnProvision setExternalComponent={setExternalComponent} identityId={identityId}
                                 identityIdList={identity}/> :
                    null
                }
            </div>
        </div>
    );
})

export default IdentityList
