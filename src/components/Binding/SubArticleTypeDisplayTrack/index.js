import './subarticle.scss';
import ProductTypesSrv from '../../../services/product_types_srv';
import React, { useState, useEffect } from 'react';
import ErrorMessage from '../../Shared/components/ErrorMessage';


function SubArticleTypeDisplayTrack(props) {
    const [subTypes, setSubTypes] = useState(null);
    const [error, setError] = useState('');

    const productTypesSrv = new ProductTypesSrv(props.auth);

    useEffect(() => {
        const getProductTypeSubs = (productTypeId)=>{
            productTypesSrv.getAllProdSubType(productTypeId).then(
                (res) => {
                    if(res.status >= 200 && res.status <= 299){
                     return res.json() 
                    }
                    else{
                        throw Error(res.statusText);
                     }
                    }
                     ).then((result) => {
                        setSubTypes(result);
                        props.setRequiredSubTypes(result);
                    }
                ).catch((error) =>{ // this context is not passed into the function
                    setError('Failed to load Article SubType Info:' + error.message);
                });       
    
        }
        getProductTypeSubs(props.article.productType.id);
      }, []);


 




    const displaySubs = ()=>{
        return(<>
            {subTypes? subTypes.map((subType,index) => {
                 var selectedStr = props.subIndex ===  index ? " selected" :""
                    return(<tr className={selectedStr} key={index} onClick={()=> props.setSubTypeIndex(index)}>
                    <td>{subType.name}</td>
                    </tr>)
            }):null}
        </>)
    }
    return(
    <>
    <table className='sub-article-table'>
        <thead>
            <tr className='top-row'>
                <th>Required Sub-Article Types</th>
                {/* <th>Sub-Article ID</th> */}
                
            </tr>
        </thead>
    <tbody>{displaySubs()}</tbody>
    </table>
    <ErrorMessage show={error !== ''?true:false} errorMessage={error}></ErrorMessage>
    </>
    )
}

export default SubArticleTypeDisplayTrack;