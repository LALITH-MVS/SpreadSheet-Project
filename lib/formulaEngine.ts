export const evaluateFormula = (
  formula: string,
  cells: Record<string, any>
) => {

  try {

    if (!formula.startsWith("=")) return formula;

    let expression = formula.substring(1);

    /* SUM range */
    expression = expression.replace(
      /SUM\(([A-Za-z][0-9]+):([A-Za-z][0-9]+)\)/gi,
      (_, start, end) => {

        const startCol = start[0].toUpperCase().charCodeAt(0);
        const startRow = parseInt(start.slice(1));

        const endCol = end[0].toUpperCase().charCodeAt(0);
        const endRow = parseInt(end.slice(1));

        let sum = 0;

        for (let col = startCol; col <= endCol; col++) {

          const colLetter = String.fromCharCode(col);

          for (let row = startRow; row <= endRow; row++) {

            const id = `${colLetter}${row}`;
            const value = cells[id]?.value;

            if (!value) continue;

            const num = parseFloat(value);
            if (!isNaN(num)) sum += num;

          }
        }

        return sum.toString();
      }
    );

    /* SUM comma */
    expression = expression.replace(
      /SUM\(([^)]+)\)/gi,
      (_, args) => {

        const list = args.split(",");

        let sum = 0;

        for (let cell of list) {

          const id = cell.trim().toUpperCase();
          const value = cells[id]?.value;

          if (!value) continue;

          const num = parseFloat(value);
          if (!isNaN(num)) sum += num;

        }

        return sum.toString();
      }
    );

    /* Replace normal cell references */
    expression = expression.replace(/[A-Za-z][0-9]+/g, (cell) => {

      const value = cells[cell]?.value;

      if (!value) return "0";

      if (value.startsWith("=")) {
        return evaluateFormula(value, cells);
      }

      const num = parseFloat(value);

      return isNaN(num) ? "0" : num.toString();
    });

    const result = eval(expression);

    return result.toString();

  } catch {
    return "ERROR";
  }

};