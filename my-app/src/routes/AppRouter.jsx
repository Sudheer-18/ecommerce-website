import { useEffect, useState } from 'react'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { OrdersPage } from '../pages/OrdersPage'
import { ProductDetailsPage } from '../pages/ProductDetailsPage'
import { ProductsPage } from '../pages/ProductsPage'
import { RegisterPage } from '../pages/RegisterPage'
import { AdminCategories } from '../pages/admin/AdminCategories'
import { AdminDashboard } from '../pages/admin/AdminDashboard'
import { AdminLoginPage } from '../pages/admin/AdminLoginPage'
import { AdminOrderDetails } from '../pages/admin/AdminOrderDetails'
import { AdminOrders } from '../pages/admin/AdminOrders'
import { AdminProductForm } from '../pages/admin/AdminProductForm'
import { AdminProducts } from '../pages/admin/AdminProducts'
import { AdminUsers } from '../pages/admin/AdminUsers'

export function AppRouter() {
  const { user, login, logout, adminUser, loginAdmin, logoutAdmin } = useAuth()
  const { cartItems, addToCart, updateQuantity, removeFromCart, subtotal, clearCart, itemCount } = useCart()
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    const handleRouteChange = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
  }

  const renderPage = () => {
    if (currentPath.startsWith('/product/')) {
      const id = currentPath.split('/').filter(Boolean).at(-1)
      return <ProductDetailsPage match={{ params: { id } }} navigate={navigate} onAddToCart={addToCart} />
    }

    if (currentPath.startsWith('/admin')) {
      if (!adminUser && currentPath !== '/admin/' && currentPath !== '/admin/login') {
        return <AdminLoginPage navigate={navigate} loginAdmin={loginAdmin} />
      }

      if (currentPath.startsWith('/admin/products/') && currentPath !== '/admin/products/new') {
        const id = currentPath.split('/').filter(Boolean).at(-1)
        if (id && id !== 'products') {
          return <AdminProductForm navigate={navigate} currentPath={currentPath} />
        }
      }

      switch (currentPath) {
        case '/admin/':
        case '/admin':
          return adminUser ? <AdminDashboard navigate={navigate} currentPath={currentPath} /> : <AdminLoginPage navigate={navigate} loginAdmin={loginAdmin} />
        case '/admin/login':
          return <AdminLoginPage navigate={navigate} loginAdmin={loginAdmin} />
        case '/admin/products':
          return <AdminProducts navigate={navigate} currentPath={currentPath} />
        case '/admin/products/new':
          return <AdminProductForm navigate={navigate} currentPath={currentPath} />
        case '/admin/categories':
          return <AdminCategories navigate={navigate} currentPath={currentPath} />
        case '/admin/orders':
          return <AdminOrders navigate={navigate} currentPath={currentPath} />
        case '/admin/orders/10482':
          return <AdminOrderDetails navigate={navigate} currentPath={currentPath} />
        case '/admin/users':
          return <AdminUsers navigate={navigate} currentPath={currentPath} />
        default:
          return adminUser ? <AdminDashboard navigate={navigate} currentPath={currentPath} /> : <AdminLoginPage navigate={navigate} loginAdmin={loginAdmin} />
      }
    }

    switch (currentPath) {
      case '/':
        return <HomePage navigate={navigate} onAddToCart={addToCart} />
      case '/products':
        return <ProductsPage navigate={navigate} searchValue={searchValue} onAddToCart={addToCart} />
      case '/cart':
        return <CartPage cartItems={cartItems} updateQuantity={updateQuantity} removeFromCart={removeFromCart} subtotal={subtotal} navigate={navigate} />
      case '/checkout':
        return <CheckoutPage cartItems={cartItems} subtotal={subtotal} navigate={navigate} user={user} clearCart={clearCart} />
      case '/login':
        return <LoginPage navigate={navigate} loginUser={login} />
      case '/register':
        return <RegisterPage navigate={navigate} loginUser={login} />
      case '/orders':
        return <OrdersPage navigate={navigate} user={user} />
      default:
        return <HomePage navigate={navigate} onAddToCart={addToCart} />
    }
  }

  return (
    <>
      {!currentPath.startsWith('/admin') && (
        <Navbar
          currentPath={currentPath}
          navigate={navigate}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          cartCount={itemCount}
          user={user}
          onLogin={() => navigate('/login')}
          onLogout={logout}
        />
      )}
      <main className={currentPath.startsWith('/admin') ? 'admin-page-content' : 'page-content'}>{renderPage()}</main>
      {!currentPath.startsWith('/admin') && <Footer />}
    </>
  )
}
