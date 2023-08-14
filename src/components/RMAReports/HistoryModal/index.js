import React, { useState, useEffect } from "react";
import ReturnsSrv from "../../../services/returns_srv";
import './historyModal.scss';
import moment from "moment";
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import * as CONST from '../../Shared/constants/ReturnActions';
import Action_Texts from '../../Shared/constants/ReturnActions';

export default function HistoryModal(props) {
    const [history, setHistory] = useState({ data:null, loading: true, error:""});

    //const useMountEffect = (fun) => useEffect(fun, []);
    //console.log(props.rmaId);
    const formatEventText = (eventText) =>{
      if(eventText && eventText !== ""){
        var words = eventText.split(' ');
        if (words[2] === CONST.ACTION){
          return CONST.ACTION + ": " + Action_Texts[words[3]];
        }else{
          return "RMA: " + words[2];
        }
      }else{
        return "";
      }
    }

      useEffect(()=>{
        const loadData = () => {
            const returnsSrv = new ReturnsSrv(props.auth);
            setHistory({ data: null, loading: true, error: "" });
            returnsSrv.getHistory(props.rma.id)
            .then((res) => {
                if (res.status >= 200 && res.status <= 299) {
                  return res.json();
                } else {
                  throw Error(res.statusText);
                }
              })
              .then((result) => {
                if (result) {
                  setHistory({ data: result, loading: false, error: "" });
                }
              })
              .catch((error) => {
                console.log("error", error);
                setHistory({
                  data: null,
                  loading: false,
                  error: "Load Status Report Error: " + error.message,
                });
              });
          };
          
              loadData()}
            ,
            [props.rma, props.auth]);

return(<div className="modal display-block" >
      <div className="modal-main ">
        <div className="header-row">
          <div className="header">
            History of RMA# {props.rma.userReturnId} <IconButton className="history-close" onClick={()=>props.setRMAID(null)}>
                    <CloseIcon />
                </IconButton>
          </div>
          {
          history.data?
          <table>
            <thead>
              <tr>
                <th>
                  Date
                </th>
                <th>
                  Event
                </th>
              </tr>
            </thead>
            <tbody>
          {history.data.map((row) =>{

            return(
              <tr key={row.id}>
                <td>
                  {moment(row.dateEvent).format("YYYY-MM-DD hh:mm A")}
                </td>
                <td>
                  {formatEventText(row.description)}
                </td>
              </tr>
              
            )
          })}
          </tbody>
          </table>:null}
        </div>
    </div>
  </div>)
}