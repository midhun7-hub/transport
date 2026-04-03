import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import axios from 'axios';
import { Mail, MailOpen, Trash2, CalendarDays, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminInbox = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/contact`, checkAuth());
            setMessages(res.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Failed to load messages");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
        try {
            await axios.patch(`${API_URL}/api/contact/${id}/status`, { status: newStatus }, checkAuth());
            setMessages(messages.map(msg => msg._id === id ? { ...msg, status: newStatus } : msg));
            toast.success(`Message marked as ${newStatus}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await axios.delete(`${API_URL}/api/contact/${id}`, checkAuth());
            setMessages(messages.filter(msg => msg._id !== id));
            toast.success("Message deleted successfully");
        } catch (error) {
            console.error("Error deleting message:", error);
            toast.error("Failed to delete message");
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Inbox</h1>
            
            {messages.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                    <div className="flex justify-center mb-4">
                        <Mail className="text-gray-300" size={64} />
                    </div>
                    <h3 className="text-xl font-medium text-gray-600">No messages yet</h3>
                    <p className="text-gray-400 mt-2">When users contact you, their messages will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {messages.map((msg) => (
                        <div 
                            key={msg._id} 
                            className={`bg-white rounded-xl shadow-sm border-l-4 transition-all duration-300 hover:shadow-md ${msg.status === 'unread' ? 'border-blue-600' : 'border-gray-300 opacity-80'}`}
                        >
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-full ${msg.status === 'unread' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {msg.status === 'unread' ? <Mail size={24} /> : <MailOpen size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">{msg.name}</h3>
                                            <div className="flex items-center text-sm text-gray-500 gap-4 mt-1">
                                                <span className="flex items-center gap-1"><User size={14}/> {msg.email}</span>
                                                {msg.phone && <span className="flex items-center gap-1"><Phone size={14}/> {msg.phone}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="flex items-center text-sm text-gray-400 gap-1">
                                            <CalendarDays size={14} /> 
                                            {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => deleteMessage(msg._id)}
                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                title="Delete Message"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap border border-gray-100 text-sm leading-relaxed">
                                    {msg.message}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminInbox;
