import './App.css'
import { Routes, Route } from 'react-router-dom';
import HeaderComp from './components/Header';
import HomePageComp from './pages/HomePage';
import LoginPageComp from './pages/LoginPage';
import ProductsPageComp from './pages/ProductsPage';
import BoughtCustomersNestedPageComp from './nestedPages/BoughtCustomersNestedPage';
import EditProductNestedPageComp from './nestedPages/EditProductNestedPage';
import NewProductNestedPageComp from './nestedPages/NewProductNestedPage';
import PurchaseProductNestedPageComp from './nestedPages/PurchaseProductNestedPage';
import CustomersPageComp from './pages/CustomersPage';
import EditCustomerNestedPageComp from './nestedPages/EditCustomerNestedPage';
import NewCustomerNestedPageComp from './nestedPages/NewCustomerNestedPage';
import PurchasesPageComp from './pages/PurchasesPage';
import UsersPageComp from './pages/UsersPage';
import RegisterPageComp from './pages/RegisterPage';
import ErrorPageComp from './pages/ErrorPage';
import PrivateRoutesLayoutComp from './nestedPages/PrivateRoutesLayout';
import { useSelector } from "react-redux";


function App() {
  const { userLogin } = useSelector((state) => state.userLoginReducer);

  return (
    <>
      <HeaderComp />
      <Routes>
        <Route>

          {/* public pages */}
          <Route path='/login' element={<LoginPageComp />} />
          <Route path='/register' element={<RegisterPageComp />} />
          <Route path='*' element={<ErrorPageComp />} />

          {/* private pages */}
          <Route element={<PrivateRoutesLayoutComp />}>
            <Route path='/' exact element={<HomePageComp />} >
              {
                userLogin?.role === 'admin' && <Route path='purchase-product' element={<PurchaseProductNestedPageComp />} />
              }
            </Route>
            <Route path='/products' element={<ProductsPageComp />} >
              {
                userLogin?.role === 'admin' && <Route path='bought-customers' element={<BoughtCustomersNestedPageComp />} />
              }{
                userLogin?.role === 'admin' && <Route path='edit-product' element={<EditProductNestedPageComp />} />
              }{
                userLogin?.role === 'admin' && <Route path='new-product' element={<NewProductNestedPageComp />} />
              }{
                userLogin?.role === 'admin' && <Route path='purchase-product' element={<PurchaseProductNestedPageComp />} />
              }{
                userLogin?.role === 'admin' && <Route path='edit-customer' element={<EditCustomerNestedPageComp />} />
              }
            </Route>
            <Route path='/customers' element={<CustomersPageComp />} >
              {
                userLogin?.role === 'admin' && <Route path='edit-customer' element={<EditCustomerNestedPageComp />} />
              }{
                userLogin?.role === 'admin' && <Route path='new-customer' element={<NewCustomerNestedPageComp />} />
              }{
                userLogin?.role === 'admin' && <Route path='edit-product' element={<EditProductNestedPageComp />} />
              }{
                userLogin?.role === 'admin' && <Route path='purchase-product' element={<PurchaseProductNestedPageComp />} />
              }
            </Route>
            <Route path='/purchases' element={<PurchasesPageComp />} />
            {
              userLogin?.role === 'admin' && <Route path='/users' element={<UsersPageComp />} />
            }
          </Route>
        </Route>
      </Routes >
    </>
  )
}

export default App
