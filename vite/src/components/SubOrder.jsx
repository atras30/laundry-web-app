import React, { useEffect, useRef, useState } from "react";
import InputBerat from "../components/InputBerat";
import InputUnit from "../components/InputUnit";
import { formatRupiah } from "../helper/helper";
import InputSet from "./InputSet";
import LoadingLayout from "../layouts/LoadingLayout";

export default function SubOrder({ calculateTotalPrice, subOrders, index, categories }) {
  const [chosenCategory, setChosenCategory] = useState([]);
  const [totalSubPrice, setTotalSubPrice] = useState(0);
  const weightInKg = useRef(null);
  const category = useRef(null);

  useEffect(() => {
    // console.log(index);
  }, []);

  function handleCategoryChange() {
    const chosenCategory = categories.find((eachCategory) => parseInt(eachCategory.id) === parseInt(category.current.value));

    setChosenCategory(chosenCategory);

    if (!chosenCategory || !weightInKg.current.value) return setTotalSubPrice(0);

    let subOrder = subOrders.find((eachOrder) => eachOrder.id === index);
    subOrder.jenisLaundry = chosenCategory.title;
    console.log(chosenCategory);
    subOrder.jumlah = `${weightInKg.current.value} ${parseInt(chosenCategory?.is_price_per_unit) === parseInt(1) ? "Unit" : parseInt(chosenCategory?.is_price_per_set) === parseInt(1) ? "Set" : "KG"}`;
    subOrder.hargaPerKilo = chosenCategory?.price;

    let subTotal = 0;
    if (chosenCategory.price_per_multiplied_kg != null) {
      subTotal = chosenCategory.price * Math.ceil(weightInKg.current.value / chosenCategory.price_per_multiplied_kg);
      subOrder.subTotal = subTotal;
      // console.log(subOrders);
      setTotalSubPrice(subTotal);
    } else {
      subTotal = chosenCategory.price * weightInKg.current.value;
      subOrder.subTotal = subTotal;
      // console.log(subOrders);
      setTotalSubPrice(subTotal);
    }

    calculateTotalPrice();
  }

  return (
    <div id={index} key={index} className="p-3 mb-3 light-grey rounded shadow pt-3 pb-4 text-black">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <label htmlFor="category" className="fw-bold">
          Jenis Layanan
        </label>
      </div>

      <LoadingLayout isLoading={categories.length === 0 ? true : false}>
        <select ref={category} id="category" className="form-select shadow-sm mb-2" aria-label="Default select example" onChange={handleCategoryChange}>
          <option>Pilih Jenis Laundry</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title} ... {`${category.price_text}`}
            </option>
          ))}
        </select>
      </LoadingLayout>

      {parseInt(chosenCategory?.is_price_per_unit) !== 1 && parseInt(chosenCategory?.is_price_per_set) !== 1 && <InputBerat weightInKg={weightInKg} handleCategoryChange={handleCategoryChange} />}
      {parseInt(chosenCategory?.is_price_per_unit) === 1 && <InputUnit weightInKg={weightInKg} handleCategoryChange={handleCategoryChange} />}
      {parseInt(chosenCategory?.is_price_per_set) === 1 && <InputSet weightInKg={weightInKg} handleCategoryChange={handleCategoryChange} />}

      <div>Total Sub Price : {formatRupiah(Math.ceil(totalSubPrice), "Rp. ")}</div>
    </div>
  );
}
