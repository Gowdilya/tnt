import { createSlice } from "@reduxjs/toolkit"; //Simplifies Redux for us

const initialState = {
  data: null,
  coordinates: { rowIndexes: [0, 0], colIndexes: [0, 0], text: [] },
  selectedFile: null,
  csvParsed: null,
  preview: null,
  transformationSet: null,
};

export const prepareDataSlice = createSlice({
  name: "prepareData",
  initialState,
  reducers: {
    reset: () => initialState,
    updateFileData: (state, action) => {
      state.data = action.payload;
    },
    updateCoordinates: (state, action) => {
      state.coordinates = action.payload;
    },
    updateCSVParsed: (state, action) => {
      state.csvParsed = action.payload;
    },
    updateSelectedFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    updatePreview: (state, action) => {
      state.preview = action.payload;
    },
    updateTransformationSet: (state, action) => {
      state.transformationSet = action.payload;
    },
    // pushTransformation: (state, action)=>{
    //   state.transformationSet.push(action.payload);
    // },
    // popTransformation: (state, action)=>{
    //   state.transformationSet.pop(action.payload);
    // }
  },
});

// Action creators are generated for each case reducer function
export const {
  updateFileData,
  updateCoordinates,
  updateSelectedFile,
  updatePreview,
  updateCSVParsed,
  updateTransformationSet,
  reset,
} = prepareDataSlice.actions;

export default prepareDataSlice.reducer;
