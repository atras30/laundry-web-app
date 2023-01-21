import Skeleton from "react-loading-skeleton";
import SkeletonLayout from "../../layouts/SkeletonLayout";

export default function CustomerSkeleton() {
  return (
    <SkeletonLayout>
      <div className="customer card text-center mb-3 overflow-hidden">
        <div className="card-header text-black fw-bold position-relative">
          <Skeleton />
        </div>
        <div className="card-body p-3">
          <p className="card-text m-2 mt-0">
            <Skeleton />
          </p>
          <p className="card-text m-2">
            <Skeleton />
          </p>
          <p className="card-text m-2">
            <Skeleton />
          </p>
          <p className="mb-2 btn btn-success w-100 fw-bold rounded-pill">
            <Skeleton baseColor="#198754" borderRadius={"5rem"} />
          </p>
          <button className="btn btn-danger w-100 fw-bold rounded-pill">
            <Skeleton baseColor="#DC3545" borderRadius={"5rem"} />
          </button>
        </div>
      </div>
    </SkeletonLayout>
  );
}
