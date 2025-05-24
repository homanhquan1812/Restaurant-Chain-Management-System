import { useRoutes } from "react-router-dom";
import MainLayout from "../layout/MainLayout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

import Dashboard from "../pages/Dashboard/Dashboard";
import CustomerList from "../pages/Customer/CustomerList";
import OrderList from "../pages/Order/OrderList";
import FeedbackList from "../pages/Feedback/FeedbackList";
import BranchList from "../pages/Branch/BranchList";
import ReservationList from "../pages/Reservation/ReservationList";
import VoucherList from "../pages/Voucher/VoucherList";
import BrandList from "../pages/Brand/BrandList";
import AddBrand from "../pages/Brand/AddBrand";
import EditBrand from "../pages/Brand/EditBrand";
import ProductPage from "../pages/Product/ProductPage";
import EmployeeList from "../pages/Employee/EmployeeList";
import AddEmployee from "../pages/Employee/AddEmployee";
import EditEmployee from "../pages/Employee/EditEmployee";

import Login from "../pages/Login/Login";
import AddOrder from "../pages/Order/AddOrder";
import EditOrder from "../pages/Order/EditOrder";
import AddCustomer from "../pages/Customer/AddCustomer";
import EditCustomer from "../pages/Customer/EditCustomer";
import AddReservation from "../pages/Reservation/AddReservation";
import EditReservation from "../pages/Reservation/EditReservation";
import AddFeedback from "../pages/Feedback/AddFeedback";
import EditFeedback from "../pages/Feedback/EditFeedback";
import AddBranch from "../pages/Branch/AddBranch";
import EditBranch from "../pages/Branch/EditBranch";
import AddVoucher from "../pages/Voucher/AddVoucher";
import EditVoucher from "../pages/Voucher/EditVoucher";
import ResetFlowContainer from "../pages/Login/ForgotPassword/ResetFlowContainer";
import BrandManagerList from "../pages/BrandManager/BrandManagerList";
import AddBrandManager from "../pages/BrandManager/AddBrandManager";
import EditBrandManager from "../pages/BrandManager/EditBrandManager";


export default function useRouteElement() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/forgot-password",
      element: <ResetFlowContainer />,
    },
    {
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/customer", element: <CustomerList /> },
        { path: "/order-list", element: <OrderList /> },
        { path: "/feedback", element: <FeedbackList /> },
        { path: "/branch", element: <BranchList /> },
        { path: "/reservation", element: <ReservationList /> },
        { path: "/voucher", element: <VoucherList /> },
        { path: "/brand", element: <BrandList /> },
        { path: "/brand/add", element: <AddBrand /> },
        { path: "/brand/edit/:id", element: <EditBrand /> },
        { path: "/product", element: <ProductPage /> },
        { path: "/employee", element: <EmployeeList /> },
        { path: "/employee/add", element: <AddEmployee /> },
        { path: "/employee/edit/:id", element: <EditEmployee /> },
        { path: "/order-list", element: <OrderList /> },
        { path: "/order/add", element: <AddOrder /> },
        { path: "/order/edit/:id", element: <EditOrder /> },
        { path: "/customer/add", element: <AddCustomer /> },
        { path: "/customer/edit/:id", element: <EditCustomer /> },
        { path: "/reservation/add", element: <AddReservation /> },
        { path: "/reservation/edit/:id", element: <EditReservation /> },
        { path: "/feedback/add", element: <AddFeedback /> },
        { path: "/feedback/edit/:id", element: <EditFeedback /> },
        // { path: "/branch/add", element: <AddBranch /> },
        // { path: "/branch/edit/:id", element: <EditBranch /> },
        { path: "/brand-manager", element: <BrandManagerList /> },
        { path: "/brand-manager/add", element: <AddBrandManager /> },
        { path: "/brand-manager/edit/:id", element: <EditBrandManager /> }, 
        { path: "/voucher/add", element: <AddVoucher /> },
        { path: "/voucher/edit/:id", element: <EditVoucher /> },
      ],
    },
  ]);

  return routes;
}
