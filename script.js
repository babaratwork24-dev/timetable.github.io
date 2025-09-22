const timetable = document.getElementById("timetable");
const tbody = document.getElementById("timetable-body");

// Load saved timetable
window.onload = function() {
  const saved = localStorage.getItem("timetableData");
  if (saved) {
    const data = JSON.parse(saved);
    tbody.innerHTML = "";
    data.forEach(rowData => {
      const row = document.createElement("tr");
      rowData.forEach(cell => {
        const td = document.createElement("td");
        td.contentEditable = "true";
        td.textContent = cell;
        row.appendChild(td);
      });
      const actionTd = document.createElement("td");
      actionTd.innerHTML = `<button class="remove-btn" onclick="removeRow(this)">Remove</button>`;
      row.appendChild(actionTd);
      tbody.appendChild(row);
    });
  }
};

// Save timetable
function saveTable() {
  const rows = tbody.rows;
  let data = [];
  for (let i = 0; i < rows.length; i++) {
    let row = [];
    const cells = rows[i].cells;
    for (let j = 0; j < cells.length - 1; j++) {
      row.push(cells[j].textContent);
    }
    data.push(row);
  }
  localStorage.setItem("timetableData", JSON.stringify(data));
  alert("✅ Timetable saved!");
}

// Clear timetable
function clearTable() {
  if (confirm("Are you sure you want to clear the timetable?")) {
    tbody.innerHTML = "";
    localStorage.removeItem("timetableData");
    alert("🗑️ Timetable cleared!");
  }
}

// Add row
function addRow() {
  const row = document.createElement("tr");
  for (let i = 0; i < 7; i++) {
    const td = document.createElement("td");
    td.contentEditable = "true";
    row.appendChild(td);
  }
  const actionTd = document.createElement("td");
  actionTd.innerHTML = `<button class="remove-btn" onclick="removeRow(this)">Remove</button>`;
  row.appendChild(actionTd);
  tbody.appendChild(row);
}

// Remove row
function removeRow(button) {
  button.parentElement.parentElement.remove();
}

// Download PDF
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("l", "pt", "a4"); // landscape

  doc.setFontSize(16);
  doc.text("Weekly Timetable", 40, 40);

  let data = [];
  const rows = timetable.rows;
  for (let i = 0; i < rows.length; i++) {
    let row = [];
    const cells = rows[i].cells;
    for (let j = 0; j < cells.length - 1; j++) { // skip "Action"
      row.push(cells[j].innerText.trim());
    }
    data.push(row);
  }

  doc.autoTable({
    head: [data[0]],
    body: data.slice(1),
    startY: 60,
    theme: 'grid',
    styles: { halign: 'center', valign: 'middle' },
    headStyles: { fillColor: [0, 123, 255], textColor: 255, fontStyle: 'bold' },
    bodyStyles: { fillColor: [249, 249, 249] },
    alternateRowStyles: { fillColor: [233, 240, 255] },
    margin: { left: 40, right: 40 }
  });

  doc.save("timetable.pdf");
}
