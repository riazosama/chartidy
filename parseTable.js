function mapRow(headings) {
  return function mapRowToObject({ cells }) {
    return [...cells].reduce(function(result, cell, i) {
      const input = cell.querySelector("input,select");
      let value;

      if (input) {
        value = input.type === "checkbox" ? input.checked : input.value;
      } else {
        value = cell.innerText;
      }

      return Object.assign(result, { [headings[i]]: value });
    }, {});
  };
}

function getHeadings(table) {
  return [...table.tHead.rows[0].cells].map(
    heading => heading.innerText
  );
}

/**
 * given a table, generate an array of objects.
 * each object corresponds to a row in the table.
 * each object's key/value pairs correspond to a column's heading and the row's value for that column
 *
 * @param  {HTMLTableElement} table the table to convert
 * @return {Array<Object>}       array of objects representing each row in the table
 */
function parseTable(table) {

  return [...table.tBodies[0].rows].map(mapRow(getHeadings(table)));
}
