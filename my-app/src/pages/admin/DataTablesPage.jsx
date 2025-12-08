import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteUserById, getAllUser, updateUser } from "../../api/user";
import Swal from "sweetalert2";

const DataTablesPage = () => {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [form, setForm] = useState({
    id: "",
    email: "",
    lastName: "",
    firstName: "",
    username: "",
    phoneNumber: "",
  });

  const [file, setFile] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const data = await getAllUser();
        console.log(data);
        setUsers(data);
      } catch (e) {
        console.log(e);
      }
    })();
    // Initialize DataTable when component mounts
    const initializeDataTable = () => {
      if (window.$ && window.$.fn.DataTable) {
        window.$("#dataTableHover").DataTable();
      }
    };

    // Load jQuery and DataTables if not already loaded
    const loadScripts = () => {
      if (!window.$) {
        const jqueryScript = document.createElement("script");
        jqueryScript.src = "/src/assets/admin/vendor/jquery/jquery.min.js";
        jqueryScript.onload = () => {
          const datatablesScript = document.createElement("script");
          datatablesScript.src =
            "/src/assets/admin/vendor/datatables/jquery.dataTables.min.js";
          datatablesScript.onload = () => {
            const bootstrapDatatablesScript = document.createElement("script");
            bootstrapDatatablesScript.src =
              "/src/assets/admin/vendor/datatables/dataTables.bootstrap4.min.js";
            bootstrapDatatablesScript.onload = initializeDataTable;
            document.head.appendChild(bootstrapDatatablesScript);
          };
          document.head.appendChild(datatablesScript);
        };
        document.head.appendChild(jqueryScript);
      } else {
        initializeDataTable();
      }
    };

    loadScripts();

    // Cleanup function
    return () => {
      if (window.$ && window.$.fn.DataTable) {
        window.$("#dataTableHover").DataTable().destroy();
      }
    };
  }, []);
  const confirmDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá người dùng này?")) return;
    await handleDelete(id);
  };
  const handleEdit = (user) => {
    setEditing(user.id);
    setForm({
      id: user.id,
      email: user.email, // chỉ hiển thị, không cho sửa
      lastName: user.lastName,
      firstName: user.firstName,
      username: user.username,
      phoneNumber: user.phoneNumber,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteUserById(id);
      // Cập nhật state: loại bỏ user có id vừa xóa
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Xóa thất bại:", err);
    }
  };
  const handleSave = async () => {
    try {
      const payload = {
        id: form.id,
        lastName: form.lastName,
        firstName: form.firstName,
        username: form.username,
        phoneNumber: form.phoneNumber,
        email: form.email,
      };
      setFile(null);
      const updated = await updateUser(payload, file);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setEditing(null);

      Swal.fire({
        title: "Success!",
        text: "User information has been updated.",
        icon: "Success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire("Eror!", "Update failure.", "error");
    }
  };

  return (
    <div className="container-fluid" id="container-wrapper">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">DataTables</h1>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/admin">Home</Link>
          </li>
          <li className="breadcrumb-item">Tables</li>
          <li className="breadcrumb-item active" aria-current="page">
            User
          </li>
        </ol>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="card mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                DataTables with Hover
              </h6>
            </div>
            <div className="table-responsive p-3">
              <table
                className="table align-items-center table-flush table-hover"
                id="dataTableHover"
              >
                <thead className="thead-light">
                  <tr>
                    <th>Email</th>
                    <th>Last Name</th>
                    <th>First Name</th>
                    <th>Username</th>
                    <th>Phone Number</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.lastName}</td>
                      <td>{user.firstName}</td>
                      <td>{user.username}</td>
                      <td>{user.phoneNumber}</td>
                      <td>
                        <div
                          className="btn-group btn-group-sm"
                          role="group"
                          aria-label="Actions"
                        >
                          <button
                            type="button"
                            onClick={() => handleEdit(user)}
                            className="btn btn-outline-warning"
                            title="Sửa"
                          >
                            <i className="bi bi-pencil"></i>
                            <span className="d-none d-sm-inline ms-1">
                              Edit
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                setDeletingId(user.id);
                                await confirmDelete(user.id);
                              } finally {
                                setDeletingId(null);
                              }
                            }}
                            className="btn btn-outline-danger"
                            title="Delete"
                            disabled={deletingId === user.id}
                          >
                            {deletingId === user.id ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                              />
                            ) : (
                              <i className="bi bi-trash"></i>
                            )}
                            <span className="d-none d-sm-inline ms-1">
                              Delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {editing && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button className="close" onClick={() => setEditing(null)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    className="form-control"
                    value={form.email}
                    readOnly
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    className="form-control"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    className="form-control"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    className="form-control"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    className="form-control"
                    value={form.phoneNumber}
                    onChange={(e) =>
                      setForm({ ...form, phoneNumber: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-light"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleSave()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTablesPage;
