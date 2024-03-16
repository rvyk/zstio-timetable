import { Aside } from "@/components/aside";
import { Header } from "@/components/header";
import { MainDrawer } from "@/components/main-drawer";
import { MainTable } from "@/components/main-table";

export function RootLayout() {
    return (
        <div className="h-screen">
            <Aside />
            <main className="flex h-full flex-col overflow-y-auto max-sm:pb-16">
                <Header />
                <MainTable />
            </main>
            <MainDrawer />
        </div>
    );
}
