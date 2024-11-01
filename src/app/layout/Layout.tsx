import React, { FC } from 'react'
import { Footer } from '@widgets/footer'
import { Header } from '@widgets/header'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@widgets/sidebar'
import { Nav } from '@widgets/nav'

export const Layout = () => {
    return (
        <>
            <div className="min-h-full overflow-hidden flex flex-col">
                <Header />
                <main className="flex-auto flex">
                    <Sidebar />
                    <div className="p-5 bg-blue-50 flex-auto">
                        <Nav />
                        <div className="bg-white rounded-xl shadow-xl p-6 backdrop-blur-xl bg-white/90 border border-blue-100">
                            <Outlet />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    )
}
