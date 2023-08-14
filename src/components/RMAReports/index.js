import React, { useState, useEffect } from "react";
import RMAReportsTable from "./RMAReportsTable";
import HistoryModal from "./HistoryModal";
import ReviewRMAModal from "./RevewRMAModal"
import "./rmaReports.scss";

export default function ReviewReports(props) {
    const [history_rma, setHistoryRMA] = useState(null);
    const [info_rma, setInfoRMA] = useState(null);
  return (
    <div className="reviewReports">
      <RMAReportsTable auth={props.auth} rowSelect={setHistoryRMA} selectRMA={setInfoRMA}/>
      {history_rma?
            <HistoryModal auth={props.auth} rma={history_rma} setRMAID={setHistoryRMA}/>
      :null}
      {info_rma?
            <ReviewRMAModal auth={props.auth} rma={info_rma} setRMAID={setInfoRMA}/>
      :null}
    </div>
  );
}
