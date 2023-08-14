
import React from 'react';
import Chip from '@material-ui/core/Chip';
import ImageIcon from '@material-ui/icons/Image';
import './imageList.scss';


function ImageList (props) {
   
   const displayImage = () => {
        return props.images.map( (image, index) => { return(
                <Chip
                    key={index}
                    icon={<ImageIcon />}
                    onClick={()=>props.previewPhoto(image.id)}
                />
            )
        }
        )
    }
    return (
        <div className="ImageList">
            {displayImage()}
        </div>
      );
    }
   
  export default ImageList;