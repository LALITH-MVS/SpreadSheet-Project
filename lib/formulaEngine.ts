export const evaluateFormula = (
  formula: string,
  cells: Record<string, string>
) => {

  try {

    if (formula.length <= 1) return "";

    let expression = formula.substring(1);

    /* SUM with comma arguments */
    expression = expression.replace(
      /SUM\(([^)]+)\)/gi,
      (_, args) => {

        if (args.includes(":")) return `SUM(${args})`;

        const cellList = args.split(",");

        let sum = 0;

        for (let cell of cellList) {

          const normalized = cell.trim().toUpperCase();
          const value = cells[normalized];

          if (!value) continue;

          if (value.startsWith("=")) {
            sum += parseFloat(evaluateFormula(value, cells)) || 0;
          } else {
            sum += parseFloat(value) || 0;
          }
        }

        return sum.toString();
      }
    );

    /* SUM range support */
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

            const cellId = `${colLetter}${row}`;
            const value = cells[cellId];

            if (!value) continue;

            if (value.startsWith("=")) {
              sum += parseFloat(evaluateFormula(value, cells)) || 0;
            } else {
              sum += parseFloat(value) || 0;
            }
          }
        }

        return sum.toString();
      }
    );

    /* Replace normal cell references */
    const parsed = expression.replace(/[A-Za-z][0-9]+/g, (cell) => {

      const normalized = cell.toUpperCase();
      const value = cells[normalized];

      if (!value) return "0";

      if (value.startsWith("=")) {
        return evaluateFormula(value, cells);
      }

      const num = parseFloat(value);

      return isNaN(num) ? "0" : num.toString();
    });

    if (parsed.trim() === "") return "";

    const result = eval(parsed);

    return result.toString();

  } catch {
    return "ERROR";
  }

};