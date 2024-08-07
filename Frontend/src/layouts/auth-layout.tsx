import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div
      className=" font-montserrat min-h-screen w-full flex items-center justify-center p-6 "
      style={{
        backgroundImage: "linear-gradient(to top left,#3D7EAA,#FFE47A)",
      }}
    >
      <Outlet />
    </div>
  );
}
