import React from "react";
import MasterLayout from "../layouts/MasterLayout";

export default function ApplicationNotFound() {
  return (
    <MasterLayout>
      <div className="container mt-5 text-black fs-2 fw-bold flex-wrap">
        Aplikasi printer belum terinstall di device kamu. Install aplikasi printer terlebih dahulu <a href="https://drive.google.com/drive/folders/1DFmnM9N4erE2PmtIXJCpp_g43KNEgxdc?usp=sharing">disini</a>.
      </div>
    </MasterLayout>
  );
}
