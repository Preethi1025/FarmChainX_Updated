import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supportApi } from '../api';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';

const UserTickets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [replying, setReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadTickets();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      console.log('📡 Loading user tickets...');
      const response = await supportApi.getUserTickets(user.id);
      
      console.log('✅ Tickets response:', response.data);
      
      if (response.data && response.data.success) {
        const ticketsData = response.data.tickets || [];
        setTickets(ticketsData);
        console.log(`✅ Loaded ${ticketsData.length} tickets`);
        
        // Auto-select first ticket if none selected
        if (ticketsData.length > 0 && !selectedTicket) {
          await viewTicketDetails(ticketsData[0]);
        }
      }
    } catch (error) {
      console.error('❌ Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewTicketDetails = async (ticket) => {
    try {
      console.log('📡 Loading ticket details for:', ticket.id);
      const response = await supportApi.getTicketMessages(ticket.id);
      
      if (response.data && response.data.success) {
        setSelectedTicket({
          ...ticket,
          messages: response.data.messages || []
        });
        console.log(`✅ Loaded ${response.data.messages?.length || 0} messages`);
      }
    } catch (error) {
      console.error('❌ Error loading ticket details:', error);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    try {
      setReplying(true);
      const messageData = {
        senderId: user.id,
        senderRole: user.role,
        message: replyMessage,
        adminResponse: false
      };

      console.log('📤 Sending reply to ticket:', selectedTicket.id);
      await supportApi.addMessageToTicket(selectedTicket.id, messageData);
      
      // Refresh ticket details
      await viewTicketDetails(selectedTicket);
      setReplyMessage('');
      
      console.log('✅ Reply sent successfully');
    } catch (error) {
      console.error('❌ Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    } finally {
      setReplying(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      'OPEN': { bg: 'bg-red-100', text: 'text-red-800', icon: <AlertCircle size={14} />, label: 'Open' },
      'IN_PROGRESS': { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Clock size={14} />, label: 'In Progress' },
      'RESOLVED': { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle size={14} />, label: 'Resolved' },
      'CLOSED': { bg: 'bg-gray-100', text: 'text-gray-800', icon: <CheckCircle size={14} />, label: 'Closed' }
    };
    
    const { bg, text, icon, label } = config[status] || { 
      bg: 'bg-gray-100', 
      text: 'text-gray-800', 
      icon: <AlertCircle size={14} />, 
      label: status 
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        {icon}
        {label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading && tickets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Support Tickets</h1>
              <p className="text-gray-600 mt-1">View and manage your support requests</p>
            </div>
            <button
              onClick={loadTickets}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-gray-800">{tickets.length}</div>
            <div className="text-gray-600 text-sm">Total Tickets</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-red-600">
              {tickets.filter(t => t.status === 'OPEN').length}
            </div>
            <div className="text-gray-600 text-sm">Open</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-blue-600">
              {tickets.filter(t => t.status === 'IN_PROGRESS').length}
            </div>
            <div className="text-gray-600 text-sm">In Progress</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-green-600">
              {tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length}
            </div>
            <div className="text-gray-600 text-sm">Resolved</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel - Tickets List */}
          <div className="lg:w-2/5">
            <div className="bg-white rounded-xl shadow border mb-4">
              {/* Filters */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pl-10 pr-8 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ALL">All Status</option>
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Showing {filteredTickets.length} of {tickets.length} tickets
                </div>
              </div>

              {/* Tickets List */}
              <div className="max-h-[500px] overflow-y-auto">
                {filteredTickets.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No tickets found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {searchTerm || statusFilter !== 'ALL' 
                        ? 'Try changing your filters' 
                        : 'Create your first support ticket'}
                    </p>
                  </div>
                ) : (
                  filteredTickets.map(ticket => (
                    <div
                      key={ticket.id}
                      onClick={() => viewTicketDetails(ticket)}
                      className={`p-4 border-b cursor-pointer transition-all hover:bg-gray-50 ${
                        selectedTicket?.id === ticket.id 
                          ? 'bg-blue-50 border-l-4 border-blue-500' 
                          : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800 truncate">{ticket.subject}</h3>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        #{ticket.ticketId} • {ticket.issueType}
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                        {ticket.description || 'No description provided'}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{formatDate(ticket.createdAt)}</span>
                        <span className="capitalize">{ticket.priority?.toLowerCase() || 'medium'} priority</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Ticket Details */}
          <div className="lg:w-3/5">
            {selectedTicket ? (
              <div className="bg-white rounded-xl shadow border">
                {/* Ticket Header */}
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedTicket.subject}</h2>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Ticket ID:</span> #{selectedTicket.ticketId}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> {getStatusBadge(selectedTicket.status)}
                        </div>
                        <div>
                          <span className="font-medium">Priority:</span> 
                          <span className={`ml-1 px-2 py-1 rounded text-xs ${
                            selectedTicket.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                            selectedTicket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {selectedTicket.priority || 'MEDIUM'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {formatDate(selectedTicket.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Issue Description */}
                <div className="p-6 border-b">
                  <h3 className="font-semibold text-gray-800 mb-3">Issue Description</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description || 'No description provided'}</p>
                  </div>
                </div>

                {/* Conversation */}
                <div className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Conversation</h3>
                  
                  <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto p-2">
                    {selectedTicket.messages?.length > 0 ? (
                      selectedTicket.messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg ${
                            msg.senderRole === 'ADMIN' 
                              ? 'bg-blue-50 border border-blue-100 ml-8' 
                              : 'bg-gray-50 border border-gray-100 mr-8'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {msg.senderRole === 'ADMIN' ? '👑 Admin Support' : '👤 You'}
                              </span>
                              {msg.isAdminResponse && (
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                                  Official Response
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{formatDate(msg.createdAt)}</span>
                          </div>
                          <p className="text-gray-700">{msg.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
                        <p>No messages yet. Waiting for admin response...</p>
                      </div>
                    )}
                  </div>

                  {/* Reply Form */}
                  {selectedTicket.status !== 'CLOSED' && (
                    <div className="border-t pt-6">
                      <h4 className="font-medium text-gray-800 mb-3">Add to Conversation</h4>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply here..."
                        rows="3"
                        className="w-full border rounded-lg p-3 mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={replying}
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={handleSendReply}
                          disabled={replying || !replyMessage.trim()}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {replying ? (
                            <>
                              <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                              Sending...
                            </>
                          ) : (
                            'Send Reply'
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        Your reply will be visible to the admin. They will respond as soon as possible.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow border p-12 text-center">
                <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No ticket selected</h3>
                <p className="text-gray-500">
                  Select a ticket from the list to view details and conversation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTickets;