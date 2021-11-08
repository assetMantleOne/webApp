import React, {useState} from "react";
// import {Dropdown} from "react-bootstrap";
import { Wrap, UnWrap, DefineAsset} from "../../forms/assets";
import {defineAsset} from "persistencejs/build/transaction/assets/define";
// import {useTranslation} from "react-i18next";
import AssetList from "./assetList";
// import {useHistory} from "react-router-dom";

const assetDefine = new defineAsset(process.env.REACT_APP_ASSET_MANTLE_API);
const Assets = () => {
    // const history = useHistory();
    // const {t} = useTranslation();
    const [externalComponent, setExternalComponent] = useState("");

    // const handleModalData = (formName) => {
    //     setExternalComponent(formName);
    //     if(formName === "MintAsset"){
    //         history.push("/mint");
    //     }
    // };
    const hanldeRoute= () =>{

    };
    return (
        <div className="accountInfo">
            {/*<p onClick={() => handleModalData("DefineAsset")}>DEFINE_ASSET</p>*/}
            {/*<div className="row">*/}
            {/*    <div className="col-md-9 card-deck">*/}
            {/*        /!*<div className="dropdown-section">*!/*/}
            {/*        /!*    <h4>Assets</h4>*!/*/}
            {/*        /!*    <Dropdown>*!/*/}
            {/*        /!*        <Dropdown.Toggle  id="dropdown-basic">*!/*/}
            {/*        /!*            {t("ACTIONS")}*!/*/}
            {/*        /!*        </Dropdown.Toggle>*!/*/}
            {/*        /!*        <Dropdown.Menu>*!/*/}
            {/*        /!*            <Dropdown.Item onClick={() => handleModalData("DefineAsset")}>{t("DEFINE_ASSET")}*!/*/}
            {/*        /!*            </Dropdown.Item>*!/*/}
            {/*        /!*            <Dropdown.Item onClick={() => handleModalData("MintAsset")}>{t("MINT_ASSET")}*!/*/}
            {/*        /!*            </Dropdown.Item>*!/*/}
            {/*        /!*            <Dropdown.Item onClick={() => handleModalData("Wrap")}>{t("WRAP")}*!/*/}
            {/*        /!*            </Dropdown.Item>*!/*/}
            {/*        /!*            <Dropdown.Item onClick={() => handleModalData("UnWrap")}>{t("UN_WRAP")}*!/*/}
            {/*        /!*            </Dropdown.Item>*!/*/}
            {/*        /!*        </Dropdown.Menu>*!/*/}
            {/*        /!*    </Dropdown>*!/*/}
            {/*        /!*</div>*!/*/}

            {/*        <AssetList hanldeRoute={()=>hanldeRoute()}/>*/}
            {/*    </div>*/}

            {/*</div>*/}
            <AssetList hanldeRoute={()=>hanldeRoute()}/>
            <div>
                {externalComponent === 'DefineAsset' ?
                    <DefineAsset setExternalComponent={setExternalComponent} ActionName={assetDefine}
                                 FormName={'Define Asset'} type={'asset'}/> :
                    null
                }
                {/*{*/}
                {/*    externalComponent === 'MintAsset' ?*/}
                {/*        <MintAsset setExternalComponent={setExternalComponent} ActionName={assetDefine}*/}
                {/*            FormName={'Mint Asset'} type={'asset'}/> :*/}
                {/*        null*/}
                {/*}*/}
                {
                    externalComponent === 'Wrap' ?
                        <Wrap setExternalComponent={setExternalComponent} FormName={'Wrap'}/> :
                        null
                }
                {
                    externalComponent === 'UnWrap' ?
                        <UnWrap setExternalComponent={setExternalComponent} FormName={'UnWrap'}/> :
                        null
                }
            </div>
        </div>
    );
};

export default Assets;
