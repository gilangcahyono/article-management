import { AppSidebar } from "@/components/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "./Header";

type Props = { children: React.ReactNode };

const DashbordLayout: React.FC<Props> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-100">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashbordLayout;
