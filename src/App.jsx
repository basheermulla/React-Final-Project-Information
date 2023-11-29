import { useState } from 'react';
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

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <HeaderComp />
      <Routes>
        <Route>
          <Route path='/' exact element={<HomePageComp />} >
            <Route path='purchase-product' element={<PurchaseProductNestedPageComp />} />
          </Route>
          <Route path='/login' element={<LoginPageComp />} />
          <Route path='/products' element={<ProductsPageComp />} >
            <Route path='bought-customers' element={<BoughtCustomersNestedPageComp />} />
            <Route path='edit-product' element={<EditProductNestedPageComp />} />
            <Route path='new-product' element={<NewProductNestedPageComp />} />
            <Route path='purchase-product' element={<PurchaseProductNestedPageComp />} />
            <Route path='edit-customer' element={<EditCustomerNestedPageComp />} />
          </Route>
          <Route path='/customers' element={<CustomersPageComp />} >
            <Route path='edit-customer' element={<EditCustomerNestedPageComp />} />
            <Route path='new-customer' element={<NewCustomerNestedPageComp />} />
            <Route path='edit-product' element={<EditProductNestedPageComp />} />
            <Route path='purchase-product' element={<PurchaseProductNestedPageComp />} />
          </Route>
          <Route path='/purchases' element={<PurchasesPageComp />} />
          <Route path='/users' element={<UsersPageComp />} />
        </Route>
      </Routes >
    </>
  )
}

export default App
