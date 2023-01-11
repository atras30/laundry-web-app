import React, { useEffect } from "react";

export default function DetailSubOrder({ subOrder }) {
  useEffect(() => {
    // console.log(subOrder);
  }, []);

  return (
    <table className="table table-bordered table-striped shadow-sm text-center rounded overflow-hidden">
      <thead className="purple-300 text-white">
        <tr>
          <th colSpan={4}>{subOrder.type}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="fw-bold">Harga</td>
          <td>{subOrder.price_text}</td>
        </tr>
        <tr>
          <td className="fw-bold">Jumlah</td>
          <td>{subOrder.amount}</td>
        </tr>
        <tr>
          <td className="fw-bold">Sub Total</td>
          <td>{subOrder.total_text}</td>
        </tr>
      </tbody>
    </table>
  );
}
