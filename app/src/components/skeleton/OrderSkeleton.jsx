import Skeleton from "react-loading-skeleton";
import SkeletonLayout from "../../layouts/SkeletonLayout";

export default function OrderSkeleton() {
  return (
    <SkeletonLayout>
      <div className="card text-center mb-3">
        <div className="card-body text-start m-0 p-0">
          <h5 className="card-header fw-bold text-center rounded-top p-2 border-2 border-black border-bottom text-white">
            <Skeleton />
          </h5>
          <div className="p-3">
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>
                    <Skeleton count={3} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Skeleton baseColor="#804FCC" height={40} />
                    <Skeleton height={75} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Skeleton count={3} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer text-muted">
          <div>
            <Skeleton />
          </div>
          <div>
            <Skeleton />
          </div>
        </div>
      </div>
    </SkeletonLayout>
  );
}
