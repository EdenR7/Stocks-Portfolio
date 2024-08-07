import { Outlet } from "react-router-dom";

import { MainNav } from "@/components/general/main-nav";
import TrendingStocksList from "@/components/general/trending_stocks/trending-stocks";

export default function PlatformLayout() {
  return (
    <>
      <MainNav />
      <TrendingStocksList />
      <div className=" px-6 py-8 max-w-screen-2xl">
        <Outlet />
      </div>
    </>
  );
}
