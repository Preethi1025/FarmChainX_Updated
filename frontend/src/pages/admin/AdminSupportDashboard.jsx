import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supportApi } from '../../api';
import './AdminSupportDashboard.css';

const AdminSupportDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('open');

  useEffect(() => {
    console.log('🟢 AdminSupportDashboard mounted');
    console.log('👤 User from auth:', user);
    console.log('👑 Admin from localStorage:', localStorage.getItem('admin'));
    
    loadTickets();
    loadStats();
  }, []);

  const loadTickets = async () => {
    try {
      console.log('📡 Fetching tickets from API...');
      setLoading(true);
      const response = await supportApi.getAllTickets();
      
      console.log('✅ API Response:', response);
      console.log('📊 Response data:', response.data);
      
      if (response.data && response.data.success) {
        const ticketsData = response.data.tickets || [];
        setTickets(ticketsData);
        console.log(`✅ Loaded ${ticketsData.length} tickets`);
        
        // Auto-select first ticket if none selected
        if (ticketsData.length > 0 && !selectedTicket) {
          setSelectedTicket(ticketsData[0]);
        }
      } else {
        console.error('❌ Backend returned error:', response.data);
      }
    } catch (error) {
      console.error('❌ Error loading tickets:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await supportApi.getSupportStats();
      if (response.data && response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleTicketClick = async (ticket) => {
    setSelectedTicket(ticket);
    try {
      const response = await supportApi.getTicketMessages(ticket.id);
      setSelectedTicket(prev => ({
        ...prev,
        messages: response.data.messages || []
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedTicket) return;

    setLoading(true);
    try {
      // Get admin ID
      const admin = JSON.parse(localStorage.getItem('admin') || '{}');
      const adminId = admin.id || '1';
      
      const messageData = {
        senderId: adminId,
        senderRole: 'ADMIN',
        message: message,
        adminResponse: true
      };

      await supportApi.addMessageToTicket(selectedTicket.id, messageData);
      
      // Update ticket status
      if (selectedTicket.status === 'OPEN') {
        await supportApi.updateTicketStatus(selectedTicket.id, 'IN_PROGRESS');
      }

      // Refresh
      const response = await supportApi.getTicketMessages(selectedTicket.id);
      setSelectedTicket(prev => ({
        ...prev,
        messages: response.data.messages || [],
        status: 'IN_PROGRESS'
      }));
      
      setMessage('');
      await loadTickets();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      await supportApi.updateTicketStatus(ticketId, newStatus);
      await loadTickets();
      
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(prev => ({
          ...prev,
          status: newStatus
        }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getFilteredTickets = () => {
    if (activeTab === 'all') return tickets;
    return tickets.filter(ticket => ticket.status === activeTab.toUpperCase());
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      'OPEN': 'bg-red-100 text-red-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'RESOLVED': 'bg-green-100 text-green-800',
      'CLOSED': 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config[status] || 'bg-gray-100'}`}>
        {status || 'UNKNOWN'}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const config = {
      'HIGH': 'bg-red-100 text-red-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'LOW': 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config[priority] || 'bg-gray-100'}`}>
        {priority || 'MEDIUM'}
      </span>
    );
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading support tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Support Ticket Management</h1>
              <p className="text-gray-600 mt-1">Manage user support tickets</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                ← Back to Dashboard
              </button>
              <button
                onClick={loadTickets}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
          
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="text-2xl font-bold text-blue-700">{stats.totalTickets || 0}</div>
                <div className="text-blue-600 text-sm">Total Tickets</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <div className="text-2xl font-bold text-red-700">{stats.openTickets || 0}</div>
                <div className="text-red-600 text-sm">Open</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <div className="text-2xl font-bold text-yellow-700">{stats.inProgressTickets || 0}</div>
                <div className="text-yellow-600 text-sm">In Progress</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="text-2xl font-bold text-green-700">{stats.resolvedTickets || 0}</div>
                <div className="text-green-600 text-sm">Resolved</div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tickets List */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <div className="flex space-x-2 mb-4">
                  {['all', 'open', 'in_progress', 'resolved'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded text-sm ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Showing {getFilteredTickets().length} tickets
                </div>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {getFilteredTickets().length > 0 ? (
                  getFilteredTickets().map(ticket => (
                    <div
                      key={ticket.id}
                      onClick={() => handleTicketClick(ticket)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedTicket?.id === ticket.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800 truncate">{ticket.subject}</h3>
                        <div className="flex gap-2">
                          {getStatusBadge(ticket.status)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        #{ticket.ticketId} • {ticket.reportedByRole}
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                        {ticket.description || 'No description'}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{formatDate(ticket.createdAt)}</span>
                        <span>{ticket.issueType}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No tickets found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="lg:w-2/3">
            {selectedTicket ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{selectedTicket.subject}</h2>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div>Ticket ID: <span className="font-medium">#{selectedTicket.ticketId}</span></div>
                        <div>Reported by: <span className="font-medium">{selectedTicket.reportedByRole} (ID: {selectedTicket.reportedById})</span></div>
                        <div>Status: {getStatusBadge(selectedTicket.status)} • Priority: {getPriorityBadge(selectedTicket.priority)}</div>
                        <div>Created: {formatDate(selectedTicket.createdAt)}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value)}
                        className="border rounded px-3 py-1 text-sm"
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-b">
                  <h3 className="font-semibold text-gray-800 mb-3">Issue Description</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description || 'No description provided'}</p>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Conversation</h3>
                  
                  <div className="mb-6 space-y-4 max-h-[300px] overflow-y-auto p-2">
                    {selectedTicket.messages?.length > 0 ? (
                      selectedTicket.messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg ${msg.senderRole === 'ADMIN' ? 'bg-blue-50 border border-blue-100 ml-8' : 'bg-gray-50 border border-gray-100 mr-8'}`}
                        >
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-sm">
                              {msg.senderRole} {msg.isAdminResponse && '(Admin)'}
                            </span>
                            <span className="text-xs text-gray-500">{formatDate(msg.createdAt)}</span>
                          </div>
                          <p className="text-gray-700">{msg.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        No messages yet. Start the conversation!
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your response here..."
                      rows="3"
                      className="w-full border rounded-lg p-3 mb-3"
                      disabled={loading}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSendMessage}
                        disabled={loading || !message.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Sending...' : 'Send Response'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-gray-400 mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No ticket selected</h3>
                <p className="text-gray-500">Select a ticket from the list to view details and respond</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportDashboard;