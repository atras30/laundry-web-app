import React from "react";

export default function SkeletonLayout({ count, children }) {
  return <div>{[...new Array(5)].map(() => children)}</div>;
}
