import React, { useState } from 'react';
import { createRoleRequest, getUserRoleRequests } from '../../../api/user.js';
import './RoleRequestForm.css';

export default function RoleRequestForm() {
    const [selectedRole, setSelectedRole] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [userRequests, setUserRequests] = useState([]);
    const [showRequests, setShowRequests] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedRole) {
            setMessage('Please select the role you want to request');
            setMessageType('error');
            return;
        }

        if (!reason.trim()) {
            setMessage('Please enter a reason for your role request');
            setMessageType('error');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            await createRoleRequest({
                role: selectedRole,
                reason: reason.trim()
            });

            setMessage('Your role request has been submitted successfully! An admin will review and respond shortly.');
            setMessageType('success');
            
            // Reset form
            setSelectedRole('');
            setReason('');
            
            // Refresh requests list
            loadUserRequests();
            
        } catch (error) {
            console.error('Error creating role request:', error);
            console.error('Error response:', error.response?.data);
            const errorMessage = error.response?.data?.error || error.message || 'An error occurred while submitting your request. Please try again later.';
            setMessage(errorMessage);
            setMessageType('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const loadUserRequests = async () => {
        try {
            const requests = await getUserRoleRequests();
            setUserRequests(requests);
        } catch (error) {
            console.error('Error loading user requests:', error);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'PENDING': { text: 'Pending', class: 'badge-warning' },
            'APPROVED': { text: 'Approved', class: 'badge-success' },
            'REJECTED': { text: 'Rejected', class: 'badge-danger' }
        };
        
        const statusInfo = statusMap[status] || { text: status, class: 'badge-secondary' };
        return <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>;
    };

    return (
        <div className="myaccount-content">
            <h3>Role Request</h3>
            
            {/* Form to create role request */}
            <div className="account-details-form">
                <form onSubmit={handleSubmit}>
                    <div className="single-input-item">
                        <label htmlFor="role" className="required">Select the role you want to request</label>
                        <select 
                            id="role" 
                            value={selectedRole} 
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="form-control"
                        >
                            <option value="">-- Select Role --</option>
                            <option value="SHOP_OWNER">Shop Owner</option>
                        </select>
                    </div>
                    
                    <div className="single-input-item">
                        <label htmlFor="reason" className="required">Reason for request</label>
                        <textarea 
                            id="reason" 
                            value={reason} 
                            onChange={(e) => setReason(e.target.value)}
                            rows="4"
                            className="form-control"
                            placeholder="Please describe why you want this role..."
                        />
                    </div>
                    
                    {message && (
                        <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
                            {message}
                        </div>
                    )}
                    
                    <div className="single-input-item">
                        <button 
                            type="submit" 
                            className="check-btn sqr-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List of submitted requests */}
            <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Request History</h4>
                    <div className="single-input-item">
                    <button 
                        className="btn"
                        onClick={() => {
                            setShowRequests(!showRequests);
                            if (!showRequests) {
                                loadUserRequests();
                            }
                        }}
                    >
                        {showRequests ? 'Hide' : 'View'} history
                    </button>
                    </div>
                </div>
                
                {showRequests && (
                    <div className="myaccount-table table-responsive">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th>Requested Role</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Admin Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">No requests yet</td>
                                    </tr>
                                ) : (
                                    userRequests.map((request) => (
                                        <tr key={request.id}>
                                            <td>
                                                <strong>
                                                    {request.requestedRole === 'SHOP_OWNER' ? 'Shop Owner' : request.requestedRole}
                                                </strong>
                                            </td>
                                            <td>{request.reason}</td>
                                            <td>{getStatusBadge(request.status)}</td>
                                            <td>{request.creationTimestamp ? new Date(request.creationTimestamp).toLocaleDateString('en-US') : '-'}</td>
                                            <td>{request.adminNote || '-'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}