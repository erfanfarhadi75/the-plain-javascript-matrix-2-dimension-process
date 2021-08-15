const notProcessedCVSTextarea = document.getElementById('notProcessedCVSTextarea');
const processedCVSTextarea = document.getElementById('processedCVSTextarea');
const CVSFileInput = document.getElementById('cvsInput');
let processedCVSString = ""
let notProcessedCVSString = ""
const badValues = []
let convertedCVSArray = [[]];
let CVSRowsDelimiters = []
CVSFileInput.addEventListener('change', (event) => {
    readCVSAsText(event)
});


// use fileReader to convert cvs file to string
function readCVSAsText(event) {
    const fr = new FileReader();
    fr.onload = function () {
        notProcessedCVSTextarea.textContent = fr.result;
        CSVToArray(fr.result)
        notProcessedCVSString = fr.result;
    }
    fr.readAsText(event.target.files[0]);
}

function CSVToArray(CVSString) {
    let CVSTotalLine = CVSString.split(/\r?\n/);
    let lastLineItemLength
    convertedCVSArray = [[]];
    for (let i = 0; i < CVSTotalLine.length; i++) {
        if (CVSTotalLine[i]) {
            convertedCVSArray[i] = CVSTotalLine[i].split(/[ ,]+/).map(Number);
            // check that length of matrix rows are same
            if (lastLineItemLength && lastLineItemLength !== convertedCVSArray[i].length) {
                alert('wrong cvs imported')
                return
            }
            // keep delimiters for use at the end
            CVSRowsDelimiters[i] = CVSTotalLine[i].match(/[,|\s]/g) || []
            // add new items to array
            convertedCVSArray[i].map((item, index) => {
                item.toString().includes("0") && badValues.push([i, index])
            })

            lastLineItemLength = convertedCVSArray[0].length;
        }

    }
    replaceBadValues()
}

//replace bad values that have been found before with their neighbours
function replaceBadValues() {
    let newValue = 0
    let neighbours = 0;
    for (let i = 0; i < badValues.length; i++) {
        debugger
        newValue = 0
        neighbours = 0
        if (convertedCVSArray[(badValues[i][0])] &&
            convertedCVSArray[(badValues[i][0])][(badValues[i][1]) + 1] &&
            !badValues.find(item => convertedCVSArray[item[0]][item[1]] ===
                convertedCVSArray[(badValues[i][0])][(badValues[i][1]) + 1])
        ) {
            newValue += convertedCVSArray[(badValues[i][0])][(badValues[i][1]) + 1];
            neighbours++;
        } // right
        if (convertedCVSArray[(badValues[i][0])] &&
            convertedCVSArray[(badValues[i][0])][(badValues[i][1]) - 1] &&
            !badValues.find(item => convertedCVSArray[item[0]][item[1]] ===
                convertedCVSArray[(badValues[i][0])][(badValues[i][1]) - 1])
        ) {
            newValue += convertedCVSArray[(badValues[i][0])][(badValues[i][1]) - 1];
            neighbours++;
        } // left
        if (convertedCVSArray[(badValues[i][0]) + 1] &&
            convertedCVSArray[(badValues[i][0]) + 1][(badValues[i][1])] &&
            !badValues.find(item => convertedCVSArray[item[0]][item[1]] ===
                convertedCVSArray[(badValues[i][0]) + 1][(badValues[i][1])])
        ) {
            newValue += convertedCVSArray[(badValues[i][0]) + 1][(badValues[i][1])];
            neighbours++;
        } // bottom
        if (convertedCVSArray[(badValues[i][0]) - 1] &&
            convertedCVSArray[(badValues[i][0]) - 1][(badValues[i][1])] &&
            !badValues.find(item => convertedCVSArray[item[0]][item[1]] ===
                convertedCVSArray[(badValues[i][0]) - 1][(badValues[i][1])])
        ) {
            newValue += convertedCVSArray[(badValues[i][0]) - 1][(badValues[i][1])];
            neighbours++;
        } // top
        if (convertedCVSArray[(badValues[i][0]) + 1] &&
            convertedCVSArray[(badValues[i][0]) + 1][(badValues[i][1]) + 1] &&
            !badValues.find(item => convertedCVSArray[item[0]][item[1]] ===
                convertedCVSArray[(badValues[i][0]) + 1][(badValues[i][1]) + 1])
        ) {
            newValue += convertedCVSArray[(badValues[i][0]) + 1][(badValues[i][1]) + 1];
            neighbours++;
        } // right bottom
        if (convertedCVSArray[(badValues[i][0]) - 1] &&
            convertedCVSArray[(badValues[i][0]) - 1][(badValues[i][1]) + 1] &&
            !badValues.find(item => convertedCVSArray[item[0]][item[1]] ===
                convertedCVSArray[(badValues[i][0]) - 1][(badValues[i][1]) + 1])
        ) {
            newValue += convertedCVSArray[(badValues[i][0]) - 1][(badValues[i][1]) + 1];
            neighbours++;
        } // right top
        if (convertedCVSArray[(badValues[i][0]) + 1] &&
            convertedCVSArray[(badValues[i][0]) + 1][(badValues[i][1]) - 1] &&
            !badValues.find(item => convertedCVSArray[item[0]][item[1]] ===
                convertedCVSArray[(badValues[i][0]) + 1][(badValues[i][1]) - 1])
        ) {
            newValue += convertedCVSArray[(badValues[i][0]) + 1][(badValues[i][1]) - 1];
            neighbours++;
        } //left bottom
        if (convertedCVSArray[(badValues[i][0]) - 1] &&
            convertedCVSArray[(badValues[i][0]) - 1][(badValues[i][1]) - 1] &&
            !badValues.find(item => convertedCVSArray[item[0]][item[1]] ===
                convertedCVSArray[(badValues[i][0]) - 1][(badValues[i][1]) - 1])
        ) {
            newValue += convertedCVSArray[(badValues[i][0]) - 1][(badValues[i][1]) - 1];
            neighbours++;
        } // left top
        convertedCVSArray[(badValues[i][0])][(badValues[i][1])] = Math.round(newValue / neighbours)


    }

    for (let i = 0; i < convertedCVSArray.length; i++) {
        for (let j = 0; j < convertedCVSArray[i].length; j++) {
            processedCVSString += convertedCVSArray[i][j];
            if (j !== convertedCVSArray[i].length - 1) {
                processedCVSString += CVSRowsDelimiters[i][j]
            }
        }
        processedCVSString += "\n"
    }
    processedCVSTextarea.textContent = processedCVSString;

}