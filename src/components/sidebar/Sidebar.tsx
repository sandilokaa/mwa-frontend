"use client";

import { usePathname } from "next/navigation";
import { Sidebar as ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const Sidebar = React.memo(function Sidebar() {

    const pathname = usePathname();

    return (
        <div className="h-screen flex">
            <ProSidebar className="border-r-0">
                <div className="p-5 bg-white">
                    <Image className="w-[180px] h-auto" src="/images/icon/mwr-logo.svg" width={180} height={100} alt="RnE Logo" priority/>
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
                        <MenuItem component={<Link href="/dashboard" prefetch/>} active={pathname === "/dashboard"} icon={<Image src="/images/icon/dashboard.svg" alt="icon" width={20} height={20}/>}>
                            Dashboard
                        </MenuItem>
                        <SubMenu label="Project" icon={<Image src="/images/icon/project.svg" alt="icon" width={20} height={20}/>}>
                            <div className="flex flex-col gap-y-1">
                                <MenuItem 
                                    component={<Link href="/project-target" prefetch/>} 
                                    active={pathname.startsWith("/project-target")} 
                                    icon={<Image src="/images/icon/project-target.svg" alt="icon" width={20} height={20}/>}
                                    className="mt-1"
                                >
                                    Project Target
                                </MenuItem>
                                <SubMenu label="Development Status" icon={<Image src="/images/icon/development-status.svg" alt="icon" width={20} height={20}/>} active={pathname.startsWith("/development-status")}>
                                    <div className="flex flex-col gap-y-1">
                                        <MenuItem 
                                            component={<Link href="/development-status/styling-design" prefetch/>} 
                                            active={pathname.startsWith("/development-status/styling-design")} 
                                            icon={<Image src="/images/icon/styling-design.svg" alt="icon" width={20} height={20}/>}
                                            className="mt-1"
                                        >
                                            Styling Design
                                        </MenuItem>
                                        <MenuItem 
                                            component={<Link href="/development-status/engineering" prefetch/>} 
                                            active={pathname.startsWith("/development-status/engineering")} 
                                            icon={<Image src="/images/icon/design-engineering.svg" alt="icon" width={20} height={20}/>}
                                        >
                                            Design Engineering
                                        </MenuItem>
                                        <MenuItem 
                                            component={<Link href="/development-status/production" prefetch/>} 
                                            active={pathname.startsWith("/development-status/production")} 
                                            icon={<Image src="/images/icon/production.svg" alt="icon" width={20} height={20}/>}
                                        >
                                            Production
                                        </MenuItem>
                                        <MenuItem 
                                            component={<Link href="/development-status/procurement" prefetch/>} 
                                            active={pathname.startsWith("/development-status/procurement")} 
                                            icon={<Image src="/images/icon/procurement.svg" alt="icon" width={20} height={20}/>}
                                        >
                                            Procurement
                                        </MenuItem>
                                    </div>
                                </SubMenu>
                                <SubMenu label="Budget Status" icon={<Image src="/images/icon/budget-status.svg" alt="icon" width={20} height={20}/>} active={pathname.startsWith("/budget-status")}>
                                    <MenuItem component={<Link href="#" prefetch/>} active={pathname === "#"} icon={<Image src="/images/icon/dashboard.svg" alt="icon" width={20} height={20}/>}>
                                        Overall Result
                                    </MenuItem>
                                    <MenuItem component={<Link href="#" prefetch/>} active={pathname === "#"} icon={<Image src="/images/icon/dashboard.svg" alt="icon" width={20} height={20}/>}>
                                        Result Month
                                    </MenuItem>
                                </SubMenu>
                                <MenuItem 
                                    component={<Link href="/highlight-issue" prefetch/>} 
                                    active={pathname.startsWith("/highlight-issue")}  
                                    icon={<Image src="/images/icon/highlight-issue.svg" alt="icon" width={20} height={20}/>}
                                >
                                    Highlight Issue
                                </MenuItem>
                                <MenuItem 
                                    component={<Link href="/photo-update" prefetch/>} 
                                    active={pathname.startsWith("/photo-update")}
                                    icon={<Image src="/images/icon/photo-update.svg" alt="icon" width={20} height={20}/>}
                                >
                                    Photo Update
                                </MenuItem>
                            </div>
                        </SubMenu>
                        <SubMenu label="People" icon={<Image src="/images/icon/people.svg" alt="icon" width={20} height={20}/>}>
                            <MenuItem 
                                component={<Link href="/recruitment" prefetch/>} 
                                active={pathname.startsWith("/recruitment")}
                                icon={<Image src="/images/icon/recruitment.svg" alt="icon" width={20} height={20}/>}
                            >
                                Recruitment
                            </MenuItem>
                        </SubMenu>
                    </div>
                </Menu>
            </ProSidebar>
        </div>
    );
})

export default Sidebar;
