import { AdminLayout } from './AdminLayout'

const users = [
  { name: 'Riya Sharma', role: 'Customer', lastLogin: '2h ago', active: true },
  { name: 'Arjun Nair', role: 'Customer', lastLogin: 'Today', active: true },
  { name: 'Padmini Rao', role: 'Admin', lastLogin: '1d ago', active: true },
  { name: 'Aman Gupta', role: 'Customer', lastLogin: '4d ago', active: false },
]

export function AdminUsers({ navigate, currentPath }) {
  return (
    <AdminLayout title="Users" navigate={navigate} currentPath={currentPath}>
      <div className="admin-panel">
        <div className="table-list user-table">
          {users.map((user) => (
            <div key={user.name} className="table-row">
              <span>{user.name}</span>
              <span>{user.role}</span>
              <span>{user.lastLogin}</span>
              <span className={`status-pill ${user.active ? 'live' : 'muted'}`}>{user.active ? 'Active' : 'Inactive'}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
