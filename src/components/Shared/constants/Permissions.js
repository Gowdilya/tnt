//INDIVIDUAL PERMISSIONS FOR MINOR COMPONENTS
export const CREATE_SHIPMENTS = "create:shipments";
export const READ_SHIPMENTS = "read:shipments";
export const READ_PRODUCTS = "read:products";
export const READ_LOCATIONS ="read:locations";


// PERMISSION GROUPING FOR MODULES
export const PACKING = [ CREATE_SHIPMENTS, READ_SHIPMENTS, READ_PRODUCTS, READ_LOCATIONS ];
