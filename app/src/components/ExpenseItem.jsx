import { format, formatRelative } from "date-fns";
import id from "date-fns/locale/id";
import { formatRupiah } from "../helper/helper";

export default function ExpenseItem({ expense, index }) {
  return (
    <tr>
      <td className="fw-bold">{index}</td>
      <td>{expense.item}</td>
      <td>{expense.quantity}</td>
      <td>{formatRupiah(expense.total)}</td>
      <td>{format(new Date(expense?.created_at), "dd MMMM yyyy", { locale: id })}</td>
    </tr>
  );
}
