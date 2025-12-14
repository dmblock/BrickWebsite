import { Outlet } from 'react-router-dom'
import Header from './Header'
import SidebarLayout from './Sidebar'

export default function MainLayout() {
  return (
    <SidebarLayout>
      <Header />
      <main className='flex-1 p-6'>
        <Outlet />
      </main>
    </SidebarLayout>
  )
}
