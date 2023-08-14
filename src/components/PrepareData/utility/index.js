




export function parseCSVData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);

    //Simple check if we have valid headers

    var firstLine = allTextLines[0].split(',');

    var csvJSON = {}
    var lines = [];
    lines.push(firstLine);

    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == lines[0].length) {

            var tarr = [];
            for (var j = 0; j < lines[0].length; j++) {
                tarr.push(data[j]);
            }
            lines.push(tarr);
        }
    }
    // alert(lines);
    //csvJSON.headers = headers;
    csvJSON.lines = lines;
    return csvJSON;
    // dispatch(updateCoordinates({ rowIndexes: [0, csvJSON.lines.length - 1], colIndexes: [0, 0] }));
    // dispatch(updateCSVParsed(csvJSON));
  
}