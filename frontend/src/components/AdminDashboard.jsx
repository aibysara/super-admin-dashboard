import React, { useEffect, useState } from 'react';

const PAGE_CHOICES = [
  { key: 'products_list', label: 'Products List' },
  { key: 'marketing_list', label: 'Marketing List' },
  { key: 'order_list', label: 'Order List' },
  { key: 'media_plans', label: 'Media Plans' },
  { key: 'offer_pricing_skus', label: 'Offer Pricing SKUs' },
  { key: 'clients', label: 'Clients' },
  { key: 'suppliers', label: 'Suppliers' },
  { key: 'customer_support', label: 'Customer Support' },
  { key: 'sales_reports', label: 'Sales Reports' },
  { key: 'finance_accounting', label: 'Finance & Accounting' },
];

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  sidebar: {
    width: 220,
    backgroundColor: '#2f3542',
    color: '#fff',
    padding: '20px 10px',
    boxSizing: 'border-box',
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sidebarItem: {
    padding: '10px 15px',
    marginBottom: 10,
    cursor: 'pointer',
    borderRadius: 4,
    userSelect: 'none',
  },
  sidebarItemHover: {
    backgroundColor: '#57606f',
  },
  mainContent: {
    flex: 1,
    padding: 20,
    overflowY: 'auto',
    backgroundColor: '#f1f2f6',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 6,
    boxShadow: '0 2px 8px rgb(0 0 0 / 0.1)',
  },
  th: {
    borderBottom: '2px solid #ced6e0',
    padding: '10px 12px',
    textAlign: 'left',
    backgroundColor: '#dfe4ea',
  },
  td: {
    borderBottom: '1px solid #ced6e0',
    padding: '8px 12px',
  },
  rightPanel: {
    width: 320,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 6,
    boxShadow: '0 2px 8px rgb(0 0 0 / 0.1)',
    marginLeft: 20,
    height: 'fit-content',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    display: 'block',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: 4,
    border: '1px solid #ccc',
    fontSize: 16,
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#3742fa',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#a4b0be',
    cursor: 'not-allowed',
  },
  message: {
    marginTop: 10,
    fontWeight: '600',
  },
};

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);  // user currently being edited
  const [editFormData, setEditFormData] = useState({
  username: '',
  email: '',
  permissions: {},
});
const [editLoading, setEditLoading] = useState(false);
const [editMessage, setEditMessage] = useState('');
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch('http://127.0.0.1:8000/users/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (!response.ok) {
        setMessage('Failed to load users');
        return;
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Error fetching users');
    }
  }

  // Simulated user creation - replace with actual API call
async function handleAddUser(e) {
  e.preventDefault();
  if (!newUserEmail) {
    setMessage('Email is required');
    return;
  }
  setLoading(true);
  setMessage('');

  try {
    const response = await fetch('http://127.0.0.1:8000/users/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ email: newUserEmail }),
    });

    if (response.ok) {
      const data = await response.json();
      setMessage(`User created successfully! Generated password: ${data.generated_password}`);
      setNewUserEmail('');
      fetchUsers();
    } else {
      const errorData = await response.json();
      setMessage(`Failed to create user: ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    console.error('Error creating user:', error);
    setMessage('Error creating user');
  } finally {
    setLoading(false);
  }
}
async function handleEdit(user) {
  setEditingUser(user);

  const permissions = user.permissions || {};

  setEditFormData({
    username: user.username || '',
    email: user.email || '',
    permissions: { ...permissions },
  });

  setEditMessage('');
}
function handleInputChange(e) {
  const { name, value } = e.target;
  setEditFormData(prev => ({ ...prev, [name]: value }));
}

function handlePermissionChange(pageKey, permType) {
  setEditFormData(prev => {
    const newPermissions = { ...prev.permissions };

    if (!newPermissions[pageKey]) {
      newPermissions[pageKey] = { can_view: false, can_edit: false };
    }

    newPermissions[pageKey][permType] = !newPermissions[pageKey][permType];

    return { ...prev, permissions: newPermissions };
  });
}
async function saveUser() {
  setEditLoading(true);
  setEditMessage('');

  try {
    const response = await fetch(`http://127.0.0.1:8000/users/${editingUser.id}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(editFormData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setEditMessage('Failed to update user: ' + (errorData.detail || 'Unknown error'));
      setEditLoading(false);
      return;
    }

    const updatedUser = await response.json();

    setUsers(users.map(u => (u.id === updatedUser.id ? updatedUser : u)));

    setEditMessage('User updated successfully!');
    setEditLoading(false);
  } catch (error) {
    setEditMessage('Error updating user.');
    setEditLoading(false);
  }
}

async function handleDelete(userId) {
  if (!window.confirm('Are you sure you want to delete this user?')) return;

  try {
    const response = await fetch(`http://127.0.0.1:8000/users/${userId}/delete/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (response.ok) {
      setUsers(users.filter((u) => u.id !== userId));
      setMessage('User deleted successfully');
    } else {
      setMessage('Failed to delete user');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    setMessage('Error deleting user');
  }
}

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      

      {/* Main Content */}
      <main style={styles.mainContent}>
        <h1 style={styles.header}>Super Admin Dashboard - User Management</h1>

        {/* User Table */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Email</th>
              {PAGE_CHOICES.map((page) => (
                <th style={styles.th} key={page.key}>
                  {page.label}
                </th>
                
              ))}
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td style={styles.td} colSpan={2 + PAGE_CHOICES.length}>
                  No users found
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id}>
                <td style={styles.td}>{user.username}</td>
                <td style={styles.td}>{user.email}</td>
                {PAGE_CHOICES.map((page) => {
                  const perm = user.permissions && user.permissions[page.key];
                  return (
                    <td style={styles.td} key={page.key}>
                      {perm ? `${perm.can_view ? 'V' : '-'} / ${perm.can_edit ? 'E' : '-'}` : '-'}
                    </td>
                  );
                })}
                <td style={styles.td}>
  <button
    style={{
      ...styles.button,
      backgroundColor: '#ffa502',
      marginRight: '8px'
    }}
    onClick={() => handleEdit(user)}
  >
    Edit
  </button>
  <button
    style={{
      ...styles.button,
      backgroundColor: '#ff4757'
    }}
    onClick={() => handleDelete(user.id)}
  >
    Delete
  </button>
</td>

              </tr>
              
            ))}
          </tbody>
        </table>
      </main>
{/* Edit User Panel */}
{editingUser && (
  <aside style={{ ...styles.rightPanel, position: 'relative' }}>
    <h3>Edit User: {editingUser.username}</h3>

    <div style={styles.formGroup}>
      <label style={styles.label}>Username</label>
      <input
        type="text"
        name="username"
        value={editFormData.username}
        onChange={handleInputChange}
        style={styles.input}
      />
    </div>

    <div style={styles.formGroup}>
      <label style={styles.label}>Email</label>
      <input
        type="email"
        name="email"
        value={editFormData.email}
        onChange={handleInputChange}
        style={styles.input}
      />
    </div>
<div style={styles.formGroup}>
  <label style={styles.label}>Permissions</label>
  <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #ddd', padding: 10 }}>
    {PAGE_CHOICES.map(({ key, label }) => {
      const perm = editFormData.permissions[key] || {
        can_view: false,
        can_edit: false,
        can_create: false,
        can_delete: false,
      };
      return (
        <div key={key} style={{ marginBottom: 8 }}>
          <strong>{label}</strong>
          <label style={{ marginLeft: 10 }}>
            <input
              type="checkbox"
              checked={perm.can_view}
              onChange={() => handlePermissionChange(key, 'can_view')}
            /> View
          </label>
          <label style={{ marginLeft: 10 }}>
            <input
              type="checkbox"
              checked={perm.can_edit}
              onChange={() => handlePermissionChange(key, 'can_edit')}
            /> Edit
          </label>
          <label style={{ marginLeft: 10 }}>
            <input
              type="checkbox"
              checked={perm.can_create}
              onChange={() => handlePermissionChange(key, 'can_create')}
            /> Create
          </label>
          <label style={{ marginLeft: 10 }}>
            <input
              type="checkbox"
              checked={perm.can_delete}
              onChange={() => handlePermissionChange(key, 'can_delete')}
            /> Delete
          </label>
        </div>
      );
    })}
  </div>
</div>


    {editMessage && (
      <div style={{ marginBottom: 10, color: editMessage.includes('success') ? 'green' : 'red' }}>
        {editMessage}
      </div>
    )}

    <button
      style={{ ...styles.button, width: '100%', marginBottom: 10 }}
      onClick={saveUser}
      disabled={editLoading}
    >
      {editLoading ? 'Saving...' : 'Save Changes'}
    </button>
    <button
      style={{ ...styles.button, backgroundColor: '#ccc', color: '#333', width: '100%' }}
      onClick={() => setEditingUser(null)}
      disabled={editLoading}
    >
      Cancel
    </button>
  </aside>
)}

      {/* Right side panel - Add user */}
      <aside style={styles.rightPanel}>
        <h3>Add New User</h3>
        <form onSubmit={handleAddUser}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter user email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button
            type="submit"
            style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Add User'}
          </button>
        </form>
        {message && <div style={styles.message}>{message}</div>}
      </aside>
    </div>
  );
}

export default AdminDashboard;
