
import React from 'react';
import './articleDisplay.scss';

function ArticleDisplay(props) {

    const displayArticles = (article)=>{
        return (
            <tr  key={article.userProductId}>
                <td>{article.productType.name}</td>
                <td>{article.userProductId}</td>
            </tr>
        )

    }
    return(
    <table className='article-table'>
    <thead>
        <tr className='top-row'>
            <th>Lock Name</th>
            <th>Lock ID</th>
        </tr>
    </thead>
    <tbody>
        {displayArticles(props.article)}
    </tbody>
    </table>)
}

export default ArticleDisplay;