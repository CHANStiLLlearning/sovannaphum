import { useState, useEffect } from 'react';
import { Newspaper, Mail, Users, Clock, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { API_BASE_URL } from '../../config';

type DataItem = { createdAt: string };

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filterMode, setFilterMode] = useState('all'); // all, today, month, year
  
  const [rawData, setRawData] = useState({
    news: [] as DataItem[],
    events: [] as DataItem[],
    contacts: [] as DataItem[],
    subscribers: [] as DataItem[]
  });
  
  const [loading, setLoading] = useState(true);

  // Real-time clock effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch data effect
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [newsRes, eventsRes, contactsRes, subsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/news`),
          fetch(`${API_BASE_URL}/api/events`),
          fetch(`${API_BASE_URL}/api/contact`),
          fetch(`${API_BASE_URL}/api/subscribe`)
        ]);
        
        const news = await newsRes.json();
        const events = await eventsRes.json();
        const contacts = await contactsRes.json();
        const subs = await subsRes.json();

        setRawData({ 
          news: news.data || [], 
          events: events.data || [], 
          contacts, 
          subscribers: subs 
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Filter function
  const filterByDate = (items: DataItem[]) => {
    if (filterMode === 'all') return items;
    
    const now = new Date();
    return items.filter(item => {
      const itemDate = new Date(item.createdAt);
      if (filterMode === 'today') {
        return itemDate.toDateString() === now.toDateString();
      }
      if (filterMode === 'month') {
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      }
      if (filterMode === 'year') {
        return itemDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const filteredStats = {
    news: filterByDate(rawData.news).length,
    events: filterByDate(rawData.events).length,
    contacts: filterByDate(rawData.contacts).length,
    subscribers: filterByDate(rawData.subscribers).length,
  };

  const cards = [
    { title: 'News Articles', value: filteredStats.news, icon: <Newspaper className="w-8 h-8 text-blue-500" />, path: '/admin/news', bg: 'bg-blue-50' },
    { title: 'Events', value: filteredStats.events, icon: <CalendarIcon className="w-8 h-8 text-green-500" />, path: '/admin/events', bg: 'bg-green-50' },
    { title: 'Contact Messages', value: filteredStats.contacts, icon: <Mail className="w-8 h-8 text-purple-500" />, path: '/admin/contacts', bg: 'bg-purple-50' },
    { title: 'Subscribers', value: filteredStats.subscribers, icon: <Users className="w-8 h-8 text-orange-500" />, path: '/admin/subscribers', bg: 'bg-orange-50' },
  ];

  const chartData = [
    { name: 'News', count: filteredStats.news, color: '#3b82f6' },
    { name: 'Events', count: filteredStats.events, color: '#22c55e' },
    { name: 'Contacts', count: filteredStats.contacts, color: '#a855f7' },
    { name: 'Subscribers', count: filteredStats.subscribers, color: '#f97316' },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome to the Khmer America School Admin Panel.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-[#9A2220] font-semibold pr-4 border-r border-gray-200">
            <Clock className="w-5 h-5" />
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="flex items-center gap-2 text-gray-600 font-medium pr-4 border-r border-gray-200">
            <CalendarIcon className="w-5 h-5" />
            {currentTime.toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select 
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="bg-transparent text-gray-700 font-medium outline-none cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#9A2220] border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, idx) => (
              <NavLink key={idx} to={card.path} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between h-40 relative overflow-hidden">
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <p className="text-gray-500 font-medium mb-1">{card.title}</p>
                    <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
                  </div>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.bg} group-hover:scale-110 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#9A2220] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                  Manage <span className="text-lg">→</span>
                </div>
              </NavLink>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Content Distribution</h2>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full uppercase tracking-wider">
                {filterMode === 'all' ? 'All Time' : filterMode === 'today' ? 'Today' : filterMode === 'month' ? 'This Month' : 'This Year'}
              </span>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} allowDecimals={false} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
