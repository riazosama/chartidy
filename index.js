// add button on DOM Load event.
window.onload = function () {
  appendVisualizeBtn();
};

const appendVisualizeBtn = () => {
  const allTables = document.getElementsByTagName("table");
  let index = 0;
  for (let table of allTables) {
    index++;
    table.id = `table-${index}`;

    const visualizeBtn = document.createElement("button");
    visualizeBtn.id = `visualizeBtn-${index}`;
    visualizeBtn.className = "vis_btn";
    visualizeBtn.innerHTML = "Visualize";
    visualizeBtn.onclick = () => {
      appendModal(index);
    };

    const btnDiv = document.createElement("div");
    btnDiv.style.textAlign = "right";
    btnDiv.appendChild(visualizeBtn);
    table.parentNode.insertBefore(btnDiv, table);
  }
};

const appendModal = (index) => {

  if (document.getElementById(`chart-div-${index}`)) {
    document.getElementById(`chart-div-${index}`).remove();
  }

  let modal = document.createElement("div");
  modal.id = `modal-${index}`;
  modal.className = "chart_modal";
  modal.innerHTML = ` 
   <!-- Modal content -->
  <div class="chart_modal-content">
      <p id="desc" class="chart-modal-content-des">Enter the column indexes to interpret in the visualization</p>
  
      <div class="chart-flex">
          <div class="chart-flex chart-flex-column">
              <p class="chart-modal-content-p chart-mb-5">X-Axis Column</p>
              <input id="x-${index}" class="chart-modal-content-input chart-mr-10" type="text">
              <small id="heading-name-x-${index}"></small>
          </div>
          <div class="chart-flex chart-flex-column">
              <p class="chart-modal-content-p chart-mb-5">Y-Axis Column</p>
              <input id="y-${index}" class="chart-modal-content-input chart-mr-10" type="text">
              <small id="heading-name-y-${index}"></small>
          </div>
      </div>
      
      <div class="chart-flex chart-flex-just-end">
          <button class="chart-modal-content-action-btn" id="cancel-${index}">Cancel</button>
          <button class="chart-modal-content-action-btn chart_primary-btn chart-ml-10" id="done-${index}">Done</button>
      </div>
  
  </div>
  `;

  // Append inside Body Tag
  let body = document.getElementsByTagName("body")[0];
  body.appendChild(modal);
  // Close Btn Functionality
  closeModal(index, modal);

  // Done Btn Functionality
  onDone(index);

};
const closeModal = (index, modal) => {
  const cancelBtn = document.getElementById(`cancel-${index}`);

  cancelBtn.onclick = () => {
    modal.remove();
  };
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.remove();
    }
  }
};

const onDone = (index) => {
  const table = document.getElementById(`table-${index}`);
  const doneBtn = document.getElementById(`done-${index}`);

  const tableHeadings = getHeadings(table);
  const headingLength = tableHeadings.length;

  setColumnNameInRealTime(index, tableHeadings);

  doneBtn.onclick = () => {

    // fetch entered values of XAxis Column and YAxis Column
    const xAxis = Number(document.getElementById(`x-${index}`).value);
    const yAxis = Number(document.getElementById(`y-${index}`).value);

    const xAxisArray = [];
    const yAxisArray = [];

    if (xAxis <= headingLength && yAxis <= headingLength && xAxis !== yAxis && xAxis !== 0 && yAxis !== 0) {
      const errorMsg = document.getElementById("error");
      if (errorMsg) {
        errorMsg.remove();
      }

      const data = parseTable(table);

      for (const value of data) {
        xAxisArray.push(value[tableHeadings[xAxis - 1]]);
        yAxisArray.push(value[tableHeadings[yAxis - 1]]);
      }

      appendChart(index, xAxisArray, yAxisArray, xAxis, yAxis, tableHeadings);

      let modal = document.getElementById(`modal-${index}`);
      modal.remove();

    } else {
      if (!document.getElementById("error")) {
        const desc = document.getElementById("desc");
        const errorMsg = document.createElement("p");
        errorMsg.id = "error";
        errorMsg.innerText = "Invalid Index";
        errorMsg.style.color = "red";
        desc.appendChild(errorMsg);
      }

    }

  }
};

const setColumnNameInRealTime = (index, headings) => {

  const xAxisElement = document.getElementById(`x-${index}`);
  const yAxisElement = document.getElementById(`y-${index}`);

  xAxisElement.onkeyup = (e) => {
    let xAxis = e.target.value;
    document.getElementById(`heading-name-x-${index}`).innerHTML =
      xAxis <= 0 || xAxis > headings.length || xAxis === "" ? "" : headings[xAxis - 1];
  };

  yAxisElement.onkeyup = (e) => {
    let yAxis = e.target.value;
    document.getElementById(`heading-name-y-${index}`).innerHTML =
      yAxis <= 0 || yAxis > headings.length || yAxis === "" ? "" : headings[yAxis - 1];
  };
};

const appendChart = (index, xAxisArray, yAxisArray, xAxis, yAxis, tableHeadings) => {
  const table = document.getElementById(`table-${index}`);
  if (!document.getElementById(`chart-${index}`)) {

    const chartDiv = document.createElement("div");
    chartDiv.id = `chart-div-${index}`;
    chartDiv.style.display = "flex";
    chartDiv.style.flexDirection = "column";

    const chartInfoDiv = document.createElement("div");
    chartInfoDiv.style.display = "flex";
    chartInfoDiv.style.justifyContent = "space-between";
    chartInfoDiv.innerHTML = `
      <h4>${tableHeadings[xAxis - 1]} Vs ${tableHeadings[yAxis - 1]}</h4>
      <img style="cursor: pointer" id="delete-chart-${index}" width="20"
       src="https://www.flaticon.com/premium-icon/icons/svg/2920/2920658.svg" alt="close">
    `;
    chartDiv.appendChild(chartInfoDiv);

    const chartWithData = document.createElement("canvas");
    chartWithData.id = `chart-${index}`;

    chartWithData.getContext("2d");

    new Chart(chartWithData, {
      type: 'line',
      data: {
        labels: xAxisArray,
        datasets: [{
          label: `${tableHeadings[xAxis - 1]} Vs ${tableHeadings[yAxis - 1]}`,
          backgroundColor: "red",
          borderColor: "red",
          data: yAxisArray.map(r => r.replace(/,/g, '')),
          fill: false,
        }]
      },
      options: {
        responsive: true
      }
    });

    chartDiv.appendChild(chartWithData);
    table.parentNode.insertBefore(chartDiv, table.nextSibling);
    deleteChart(index);
  }
};

const deleteChart = (index) => {
  const clear = document.getElementById(`delete-chart-${index}`);
  clear.onclick = () => {
    document.getElementById(`chart-div-${index}`).remove();
  }
};


