import React from "react";

export default function Category({ category }) {
  return (
    <option value={category.id}>
      {category.title} - {category.price} {category.price_per_multiplied_kg ? `/ ${category.price_per_multiplied_kg} KG` : ""}
    </option>
  );
}
