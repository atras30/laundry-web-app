import React from "react";
import Skeleton from "react-loading-skeleton";

export default function ExpenseSkeleton() {
  return (
    <tr>
      <td colSpan={7}>
        <Skeleton count={6} height={30} />
      </td>
    </tr>
  );
}
