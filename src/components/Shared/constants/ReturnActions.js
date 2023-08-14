export const REQUEST_RECIEVED = "RequestReceived";
export const REQUEST_ACKNOWLEDGED = "RequestAcknowledged";
export const WARRANTY_VALIDATED = "WarrantyValidated";
export const WARRANTY_REJECTED = "WarrantyRejected";
export const REPLACEMENT_TRADE = "ReplacementTrade";
export const REPLACEMENT_NO_TRADE= "ReplacementNoTrade";
export const GRANT_CREDIT_TRADE = "GrantCreditTrade";
export const GRANT_CREDIT_NO_TRADE = "GrantCreditNoTrade";
export const ORDER_INVESTIGATION = "OrderInvestigation";

export const REQUEST_RECIEVED_TXT = "Request Received";
export const REQUEST_ACKNOWLEDGED_TXT = "Acknowledge Request";
export const WARRANTY_VALIDATED_TXT = "Warranty Validated";
export const WARRANTY_REJECTED_TXT = "Warranty Rejected";
export const REPLACEMENT_TRADE_TXT = "Replacement Trade";
export const REPLACEMENT_NO_TRADE_TXT= "Replacement No Trade";
export const GRANT_CREDIT_TRADE_TXT = "Grant Credit Trade";
export const GRANT_CREDIT_NO_TRADE_TXT = "Grant Credit No Trade";
export const ORDER_INVESTIGATION_TXT = "Order Investigation";

export const REQUESTED = "Requested";
export const CANCELLED = "Cancelled";
export const OPENED = "Opened";
export const ACTION = "Action";

export const ReturnActions = [ REQUEST_ACKNOWLEDGED, WARRANTY_VALIDATED, WARRANTY_REJECTED, REPLACEMENT_TRADE, REPLACEMENT_NO_TRADE, GRANT_CREDIT_TRADE, GRANT_CREDIT_NO_TRADE, ORDER_INVESTIGATION]

 const Action_Texts = {};

 Action_Texts[REQUEST_RECIEVED] = REQUEST_RECIEVED_TXT;
 Action_Texts[REQUEST_ACKNOWLEDGED] = REQUEST_ACKNOWLEDGED_TXT;
 Action_Texts[WARRANTY_VALIDATED] = WARRANTY_VALIDATED_TXT;
 Action_Texts[WARRANTY_REJECTED] = WARRANTY_REJECTED_TXT
 Action_Texts[REPLACEMENT_NO_TRADE] = REPLACEMENT_NO_TRADE_TXT;
 Action_Texts[REPLACEMENT_TRADE] = REPLACEMENT_TRADE_TXT;
 Action_Texts[GRANT_CREDIT_TRADE] =  GRANT_CREDIT_TRADE_TXT;
 Action_Texts[GRANT_CREDIT_NO_TRADE] = GRANT_CREDIT_NO_TRADE_TXT;
 Action_Texts[ORDER_INVESTIGATION] = ORDER_INVESTIGATION_TXT


 export default Action_Texts;

 
 