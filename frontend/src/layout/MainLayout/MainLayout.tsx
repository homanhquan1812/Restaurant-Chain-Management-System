import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'
import Header from '../../components/Header/Header'
import { useMediaQuery } from 'react-responsive'
import { useLoading } from '../../contexts/LoadingContext'
import Loading from '../../components/Loading/Loading'

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const { isLoading } = useLoading()

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <>
      {isLoading && <Loading visible />}
      <div className="flex bg-gray-50 w-full h-full">
        {/* Sidebar */}
        {!isMobile && (
          <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300`}>
            {sidebarOpen && <Sidebar />}
          </div>
        )}
        {isMobile && sidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeSidebar}></div>
            <div className="fixed inset-0 z-50 bg-white shadow-lg flex flex-col w-full h-full">
              <Sidebar onClose={closeSidebar} />
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="flex flex-col flex-1 w-full overflow-x-auto transition-all duration-300">
          <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          <main className="flex-1 w-full max-w-screen mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

export default MainLayout
