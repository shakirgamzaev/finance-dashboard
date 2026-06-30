import AppLogo from "@/app/_components/AppLogo";


export default function DashboardLayout({children}: {children: React.ReactNode}) {
    return(
        <header className="bg-linear-to-b from-blue-800 to-blue-600 h-25 lg:h-[200px]">
            <div className="w-full max-w-[1300px] p-6 mx-auto hidden lg:flex flex-col">
                <div className="flex ">
                    <AppLogo width={140} height={30}></AppLogo>
                </div>
            </div>
        </header>
    )
}