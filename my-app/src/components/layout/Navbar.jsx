import { SearchBar } from './SearchBar'

export function Navbar({ currentPath, navigate, searchValue, onSearchChange, cartCount, user, onLogin, onLogout }) {
  return (
    <header className="topbar">
      <div className="brand-wrap" onClick={() => navigate('/')} role="button" tabIndex={0} onKeyDown={(event) => { if(event.key === 'Enter') navigate('/') }}>
        <div className="brand-badge">E</div>
        <div>
          <div className="brand-name">ElectroMart</div>
          <div className="brand-tag">Electronics store</div>
        </div>
      </div>

      <SearchBar value={searchValue} onChange={onSearchChange} placeholder="Search products, brands and deals" />

      <nav className="nav-actions" aria-label="Main navigation">
        <button type="button" className="nav-button ghost" onClick={() => navigate('/products')}>Shop</button>
        <button type="button" className="nav-button ghost" onClick={() => navigate('/orders')}>Orders</button>
        {user ? (
          <>
            <span className="user-pill">Hi, {user.name || user.email?.split('@')[0]}</span>
            <button type="button" className="nav-button" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <button type="button" className="nav-button ghost" onClick={onLogin}>Login</button>
            <button type="button" className="nav-button accent" onClick={() => navigate('/register')}>Register</button>
          </>
        )}
        <button type="button" className="cart-button" onClick={() => navigate('/cart')}>
          🛒 <span>Cart</span> <strong>{cartCount}</strong>
        </button>
      </nav>
    </header>
  )
}
