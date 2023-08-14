import './subarticle.scss';
import React from 'react';

import DeleteIcon from '@material-ui/icons/RemoveCircle';
import IconButton from '@material-ui/core/IconButton';


function SubArticleDisplay(props) {

    const displaySubs = ()=>{
        return(<>
            {props.subArticles ? props.subArticles.map((sub,index) => {return(<tr key={index}>
                <td>{sub.subProductType.name}</td>
                <td>{sub.code}</td>
                <td><IconButton aria-label="delete" onClick={(e) => props.removeSub(sub.id)} >
                                            <DeleteIcon />
                                        </IconButton></td>
                </tr>)}):null}
        </>)
    }
    return(
       
    <table className='sub-article-table'>
         {props.subArticles.length > 0 ?
        <thead>
            <tr className='top-row'>
                <th>Scanned Sub-Article Type</th>
                <th>Scanned Sub-Article Code</th>  
                <th>Remove</th>
            </tr>
        </thead>
        :null}
    <tbody>{displaySubs()}</tbody>
    </table>
    )
}

export default SubArticleDisplay;