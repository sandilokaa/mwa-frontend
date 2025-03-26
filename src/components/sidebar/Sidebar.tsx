"use client";

import { usePathname } from "next/navigation";
import { Sidebar as ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import Link from "next/link";
import Image from "next/image";

export default function Sidebar() {

    const pathname = usePathname();

    return (
        <div className="h-screen flex">
            <ProSidebar className="border-r-0">
                <div className="p-5 bg-white">
                    <Image className="w-[180px] h-auto" src="/images/icon/prodflow-logo.svg" width={180} height={100} alt="Prodflow Logo"/>
                </div>
                <Menu 
                    className="h-full bg-white p-5"
                    menuItemStyles={{
                        button: ({active}) => ({
                            backgroundColor: active ? '#DDEDFF' : "transparent",
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: '#DDEDFF',
                                borderRadius: '8px'
                            }
                        }),
                        icon: {
                            padding: '0px',
                            marginLeft: '-15px',
                            marginRight: '0px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }
                    }}
                >
                    <div className="text-gray-400 text-sm font-medium">
                        <span>Menu</span>
                    </div>
                    <div className="flex flex-col mt-[10px] gap-y-2 text-sm text-[#144C68] font-medium">
                        <MenuItem component={<Link href="/dashboard" />} active={pathname === "/dashboard"} icon={<Image src="/images/icon/dashboard.svg" alt="icon" width={20} height={20}/>}>
                            Dashboard
                        </MenuItem>
                        <MenuItem 
                            component={<Link href="/project-target" />} 
                            active={pathname.startsWith("/project-target")} 
                            icon={<Image src="/images/icon/project-target.svg" alt="icon" width={20} height={20}/>}
                        >
                            Project Target
                        </MenuItem>
                        <SubMenu label="Development Status" icon={<Image src="/images/icon/development-status.svg" alt="icon" width={20} height={20}/>}>
                            <div className="flex flex-col gap-y-1">
                                <MenuItem 
                                    component={<Link href="/development-status/styling-design" />} 
                                    active={pathname.startsWith("/development-status/styling-design")} 
                                    icon={<Image src="/images/icon/dashboard.svg" alt="icon" width={20} height={20}/>}
                                >
                                    Styling Design
                                </MenuItem>
                                <MenuItem 
                                    component={<Link href="/development-status/engineering" />} 
                                    active={pathname.startsWith("/development-status/engineering")} 
                                    icon={<Image src="/images/icon/dashboard.svg" alt="icon" width={20} height={20}/>}
                                >
                                    Engineering
                                </MenuItem>
                                <MenuItem 
                                    component={<Link href="/development-status/production" />} 
                                    active={pathname.startsWith("/development-status/production")} 
                                    icon={<Image src="/images/icon/dashboard.svg" alt="icon" width={20} height={20}/>}
                                >
                                    Production
                                </MenuItem>
                                <MenuItem 
                                    component={<Link href="/development-status/procurement" />} 
                                    active={pathname.startsWith("/development-status/procurement")} 
                                    icon={<Image src="/images/icon/procurement.svg" alt="icon" width={20} height={20}/>}
                                >
                                    Procurement
                                </MenuItem>
                            </div>
                        </SubMenu>
                        <SubMenu label="Budget Status" icon={<Image src="/images/icon/budget-status.svg" alt="icon" width={20} height={20}/>}>
                            <MenuItem component={<Link href="#" />} active={pathname === "#"} icon={<Image src="/images/icon/dashboard.svg" alt="icon" width={20} height={20}/>}>
                                Overall Result
                            </MenuItem>
                            <MenuItem component={<Link href="#" />} active={pathname === "#"} icon={<Image src="/images/icon/dashboard.svg" alt="icon" width={20} height={20}/>}>
                                Result Month
                            </MenuItem>
                        </SubMenu>
                        <MenuItem 
                            component={<Link href="/highlight-issue" />} 
                            active={pathname.startsWith("/highlight-issue")}  
                            icon={<Image src="/images/icon/highlight-issue.svg" alt="icon" width={20} height={20}/>}
                        >
                            Highlight Issue
                        </MenuItem>
                        <MenuItem 
                            component={<Link href="/photo-update" />} 
                            active={pathname.startsWith("/photo-update")}
                            icon={<Image src="/images/icon/photo-update.svg" alt="icon" width={20} height={20}/>}
                        >
                            Photo Update
                        </MenuItem>
                    </div>
                </Menu>
            </ProSidebar>
        </div>
    );
}
