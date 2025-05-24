import { Provider } from 'react-redux'
import { store } from './redux/store'
import { SidebarProvider } from './contexts/SidebarContext'
import { LoadingProvider } from './contexts/LoadingContext'
import useRouteElement from './hooks/useRouteElement'
import './index.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const routeElement = useRouteElement()

  return (
    <Provider store={store}>
      <SidebarProvider>
        <LoadingProvider>
          {routeElement}
        </LoadingProvider>
      </SidebarProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </Provider>
  )
}

export default App
