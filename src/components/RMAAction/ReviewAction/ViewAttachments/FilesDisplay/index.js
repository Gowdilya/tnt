import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import ImageIcon from "@material-ui/icons/Image";
import "./fileDisplay.scss";
import { Link } from "react-router-dom";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { IconButton } from '@material-ui/core';
import Paper from "@material-ui/core/Paper";


function FilesDisplay(props) {
  const handlePreview = (url) =>{
    props.showPreview(url);
  }
  return (
    <div className="file-display">
      {props.files.map((file) => {
        var imageUrl = file.url.href; //dev, qa ,prod
        // var imageUrl = file.url.href.replace(
        //   "host.docker.internal",
        //   "localhost"
        // ); //local
        return (
          <Paper elevation={5} key={file.id} className="photo-container">
            <img className="photos" src={imageUrl} alt="new"  />
            <IconButton className="download-button show" onClick={()=>handlePreview(imageUrl)} variant="contained">
                <VisibilityIcon></VisibilityIcon>
            </IconButton>
            <a  href={imageUrl} download={file.id}>
              <IconButton className="download-button show" variant="contained">
                <ArrowDownwardIcon></ArrowDownwardIcon>
              </IconButton>
            </a>
          </Paper>
        );
      })}
    </div>
  );
}
export default FilesDisplay;
