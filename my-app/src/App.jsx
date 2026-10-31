import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { AppRouter } from './routes/AppRouter'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
