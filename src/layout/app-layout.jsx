// import { Header } from "@/components/Header";
// import { Header } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";


const AppLayout = () => {
  return (
    <div>
        <div className="grid-background"></div>
        <main className="min-h-screen container">
            <Header/>
            <Outlet/>
            </main>
            <div className="p-10 text-center bg-gray-800 mt-10">
                Built by Davidraju Boddupalli ✦ CareerCraft
            </div>
      
    </div>
  );
};

export default AppLayout;
