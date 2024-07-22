import "./App.css";
import "./bootstrap_cust.min.css";
import React, { useEffect, useState } from "react";
import Comment from "./comments";
import * as themes from "./theme/schema.json";
import { setToLS } from "./utils/storage";
const { tableau } = window;
const { extensions } = tableau.extensions;
function App() {
  const [dashboardName, setDashboardName] = useState("");
  const [username, setUsername] = useState();
  const popupUrl = window.location.host;
  const Index = () => {
    setToLS("all-themes", themes.default);
    return <Comment username={username}></Comment>;
  };
  let UserName = "";
  function reduceToObjects(cols, data) {
    // let fieldNameMap = $.map(cols, function(col) { return col.fieldName; });
    let fieldNameMap = cols.map((col) => col.fieldName);
    let dataToReturn = data.map((d) => {
      return d.reduce(function (memo, value, idx) {
        memo[fieldNameMap[idx]] = value.formattedValue;
        return memo;
      }, {});
    });
    return dataToReturn;
  }

  let options = {
    maxRows: 1, // Max rows to return. Use 0 to return all rows
    ignoreAliases: false,
    ignoreSelection: false,
    includeAllColumns: true,
  };

  const getUsernameUsingSheetData = () => {
    const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
    return getSheetDataForUsername(worksheets, 0);
  };

  const getSheetDataForUsername = (worksheets, index) => {
    return new Promise(function (resolve, reject) {
      const summaryOptions = {
        maxRows: 0, // Max rows to return. Use 0 to return all rows
        ignoreAliases: false,
        ignoreSelection: false,
        includeAllColumns: true,
        summary: true,
        tableauDataTranspose: true,
      };
      if (index < worksheets.length) {
        const sheetName = worksheets[index].name;
        getSheetData(sheetName, summaryOptions)
          .then(function (sheetData) {
            const dataRow = sheetData && sheetData.length ? sheetData[0] : {};
            if (dataRow.hasOwnProperty("AsUser")) {
              UserName = dataRow.AsUser;
              console.log("Found AsUser wb -->: ", UserName);
              setUsername(UserName);
              resolve(UserName);
            } else {
              resolve(getSheetDataForUsername(worksheets, ++index));
            }
          })
          .catch(function (error) {
            console.log("Error getting data for sheet: ", error);
            resolve(UserName);
          });
      } else {
        resolve(UserName);
      }
    });
  };

  const transposeData = (dataTable) => {
    const columns = dataTable.columns.map(function (col) {
      let colName = col.fieldName;
      return colName.replace(/[^a-zA-Z0-9]/g, "_").replace(/^[^a-zA-Z]/, "_");
    });

    const fixedKeys = ["Measure_Names", "Measure_Values"];
    const fixedKeysIndex = fixedKeys.map(function (key) {
      return columns.indexOf(key);
    });
    const fixedKeysSet = new Set();
    fixedKeysIndex.forEach(function (index) {
      fixedKeysSet.add(index);
    });
    const rowMap = {};
    dataTable.data.forEach(function (partialRow) {
      let key = "";
      partialRow.forEach(function (col, index) {
        if (!fixedKeysSet.has(index)) {
          key += partialRow[index].formattedValue;
        }
      });
      if (!rowMap.hasOwnProperty(key)) {
        rowMap[key] = partialRow.reduce(function (res, item, index) {
          const obj = {};
          obj[columns[index]] = item.formattedValue;
          return Object.assign(res, obj);
        }, {});
        fixedKeys.forEach(function (fixedKey) {
          delete rowMap[key][fixedKey];
        });
      }
      if (fixedKeysIndex[0] !== -1 && fixedKeysIndex[1] !== -1) {
        const obj = {};
        obj[
          partialRow[fixedKeysIndex[0]].formattedValue
            .replace(/[^a-zA-Z0-9]/g, "_")
            .replace(/^[^a-zA-Z]/, "_")
        ] = partialRow[fixedKeysIndex[1]].formattedValue;
        Object.assign(rowMap[key], obj);
      }
    });
    const transposedData = Object.keys(rowMap).map(function (key) {
      return rowMap[key];
    });
    return transposedData;
  };

  const getSheetData = (sheetName, options, appendSheetName) => {
    return new Promise(function (resolve, reject) {
      const dashboard = tableau.extensions.dashboardContent.dashboard;
      const worksheets = dashboard.worksheets;
      let worksheet = worksheets.find(function (sheet) {
        return sheet.name === sheetName;
      });
      let functionName = "getUnderlyingDataAsync";
      if (options.summary) {
        functionName = "getSummaryDataAsync";
      }
      worksheet[functionName](options)
        .then(function (dataTable) {
          console.log(dataTable);
          let data = dataTable.data;
          let field2 = dataTable.columns.map(function (item) {
            return item["fieldName"];
          });
          let underlyingData = [];
          if (options.summary) {
            if (options.tableauDataTranspose) {
              console.log("Transposing data for ", sheetName);
              underlyingData = transposeData(dataTable);
            } else {
              console.log(
                "Transpose disabled, Setting data without modification for ",
                sheetName
              );
              underlyingData = reduceToObjects(
                field2,
                data,
                appendSheetName ? sheetName : false
              );
            }
          } else {
            underlyingData = reduceToObjects(
              field2,
              data,
              appendSheetName ? sheetName : false
            );
          }
          console.log("Data: ", underlyingData);
          resolve(underlyingData);
        })
        .catch(function (error) {
          console.log("Error fetching data for sheet: ", error);
          resolve([]);
        });
    });
  };

  useEffect(() => {
    tableau.extensions.initializeAsync().then(() => {
      debugger;
      const worksheets =
        tableau.extensions.dashboardContent.dashboard.worksheets;
      return getSheetDataForUsername(worksheets, 0);
      // const dashboardName = tableau.extensions.dashboardContent.dashboard;
      // console.log("dashboardName-->",dashboardName);
      // dashboardName.findParameterAsync('username').then(paramslist => {
      //   console.log("paramslist-->",paramslist)
      //   console.log("Got Username==>",paramslist.currentValue.value);
      //   setUsername(paramslist.currentValue.value);
      //   setDashboardName(dashboardName);
      // })
    });
  }, []);

  return (
    <React.Fragment>
      <Index />
    </React.Fragment>
  );
}

export default App;
