import Skeleton from "react-loading-skeleton";
import SkeletonLayout from "../../layouts/SkeletonLayout";

export default function CategorySkeleton() {
  return (
    <section className="price-list">
      <h1 className="text-center mt-5 fw-bold">Price List</h1>
      <p className="text-center text-danger fw-bold mb-3">*Estimasi waktu pengerjaan : 3 Hari</p>
      <table className="table table-striped shadow rounded overflow-hidden">
        <thead className="light-grey-background text-white">
          <tr>
            <th className="p-2 text-center">#</th>
            <th className="p-2">Layanan</th>
            <th className="p-2">Harga</th>
          </tr>
        </thead>
        <tbody className="table-light">
          {[...new Array(10)].map((_, index) => {
            return (
              <tr key={index} className="fw-semibold">
                <td className="text-center">
                  <Skeleton />
                </td>
                <td>
                  <Skeleton />
                </td>
                <td>
                  <Skeleton />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
