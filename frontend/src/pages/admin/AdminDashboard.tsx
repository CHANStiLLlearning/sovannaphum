import { useState, useEffect } from 'react';
import { Newspaper, Mail, Users, Clock, Calendar as CalendarIcon, Filter, GraduationCap, ArrowUpRight, TrendingUp } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { API_BASE_URL } from '../../config';

type DataItem = { createdAt: string };

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filterMode, setFilterMode] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  const [rawData, setRawData] = useState({
    news: [] as DataItem[],
    events: [] as DataItem[],
    contacts: [] as DataItem[],
    subscribers: [] as DataItem[],
    teachers: [] as DataItem[],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [newsRes, eventsRes, contactsRes, subsRes, teachersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/news`),
          fetch(`${API_BASE_URL}/api/events`),
          fetch(`${API_BASE_URL}/api/contact`),
          fetch(`${API_BASE_URL}/api/subscribe`),
          fetch(`${API_BASE_URL}/api/teachers?limit=1000`),
        ]);
        const news = await newsRes.json();
        const events = await eventsRes.json();
        const contacts = await contactsRes.json();
        const subs = await subsRes.json();
        const teachers = await teachersRes.json();
        setRawData({
          news: news.data || [],
          events: events.data || [],
          contacts,
          subscribers: subs,
          teachers: teachers.data || [],
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const filterByDate = (items: DataItem[]) => {
    if (filterMode === 'all') return items;
    const now = new Date();
    return items.filter((item) => {
      if (!item.createdAt) return false;
      const d = new Date(item.createdAt);
      if (filterMode === 'today') return d.toDateString() === now.toDateString();
      if (filterMode === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (filterMode === 'year') return d.getFullYear() === now.getFullYear();
      if (filterMode === 'custom' && selectedDate) {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` === selectedDate;
      }
      return true;
    });
  };

  const filteredStats = {
    news: filterByDate(rawData.news).length,
    events: filterByDate(rawData.events).length,
    contacts: filterByDate(rawData.contacts).length,
    subscribers: filterByDate(rawData.subscribers).length,
    teachers: filterByDate(rawData.teachers).length,
  };

  const cards = [
    {
      title: 'News Articles',
      value: filteredStats.news,
      icon: <Newspaper className="w-6 h-6" />,
      path: '/admin/news',
      gradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      lightText: 'text-blue-600',
      shadowColor: 'shadow-blue-200',
    },
    {
      title: 'Events',
      value: filteredStats.events,
      icon: <CalendarIcon className="w-6 h-6" />,
      path: '/admin/events',
      gradient: 'from-emerald-500 to-emerald-600',
      lightBg: 'bg-emerald-50',
      lightText: 'text-emerald-600',
      shadowColor: 'shadow-emerald-200',
    },
    {
      title: 'Contact Messages',
      value: filteredStats.contacts,
      icon: <Mail className="w-6 h-6" />,
      path: '/admin/contacts',
      gradient: 'from-violet-500 to-violet-600',
      lightBg: 'bg-violet-50',
      lightText: 'text-violet-600',
      shadowColor: 'shadow-violet-200',
    },
    {
      title: 'Subscribers',
      value: filteredStats.subscribers,
      icon: <Users className="w-6 h-6" />,
      path: '/admin/subscribers',
      gradient: 'from-amber-500 to-orange-500',
      lightBg: 'bg-amber-50',
      lightText: 'text-amber-600',
      shadowColor: 'shadow-amber-200',
    },
    {
      title: 'Faculty Members',
      value: filteredStats.teachers,
      icon: <GraduationCap className="w-6 h-6" />,
      path: '/admin/faculty',
      gradient: 'from-rose-500 to-[#9A2220]',
      lightBg: 'bg-rose-50',
      lightText: 'text-rose-600',
      shadowColor: 'shadow-rose-200',
    },
  ];

  const chartData = [
    { name: 'News', count: filteredStats.news, color: '#3b82f6' },
    { name: 'Events', count: filteredStats.events, color: '#10b981' },
    { name: 'Contacts', count: filteredStats.contacts, color: '#8b5cf6' },
    { name: 'Subscribers', count: filteredStats.subscribers, color: '#f59e0b' },
    { name: 'Faculty', count: filteredStats.teachers, color: '#9A2220' },
  ];

  const filterLabel =
    filterMode === 'all' ? 'All Time'
    : filterMode === 'today' ? 'Today'
    : filterMode === 'month' ? 'This Month'
    : filterMode === 'year' ? 'This Year'
    : selectedDate ? selectedDate
    : 'Select Date';

  return (
    <div className="font-sans">

      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#9A2220] mb-1">Admin Panel</p>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1 text-sm">Welcome back — here's what's happening with your school.</p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Clock */}
          <div className="flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-2.5">
            <Clock className="w-4 h-4 text-[#9A2220]" />
            <span className="text-sm font-bold text-gray-700 tabular-nums">{currentTime.toLocaleTimeString()}</span>
          </div>
          {/* Date */}
          <div className="flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-2.5">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">{currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          {/* Filter */}
          <div className="flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-2.5">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterMode}
              onChange={(e) => { setFilterMode(e.target.value); if (e.target.value !== 'custom') setSelectedDate(''); }}
              className="text-sm font-semibold text-gray-700 bg-transparent outline-none cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="custom">Pick Date</option>
            </select>
            {filterMode === 'custom' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-700 outline-none focus:ring-2 focus:ring-[#9A2220]/20 focus:border-[#9A2220]"
              />
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-[#9A2220] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
            {cards.map((card, idx) => (
              <NavLink
                key={idx}
                to={card.path}
                className="group relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col gap-4"
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${card.gradient} shadow-md`}>
                    {card.icon}
                  </div>
                  <span className={`flex items-center justify-center w-7 h-7 rounded-full ${card.lightBg} ${card.lightText} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>

                {/* Count */}
                <div>
                  <p className="text-4xl font-black text-gray-900 leading-none">{card.value}</p>
                  <p className="text-sm font-medium text-gray-400 mt-1">{card.title}</p>
                </div>

                {/* Bottom accent bar */}
                <div className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${card.gradient}`} />
              </NavLink>
            ))}
          </div>

          {/* ── Chart + Quick Links Row ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Bar Chart */}
            <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#9A2220]" />
                  <h2 className="text-lg font-bold text-gray-900">Content Distribution</h2>
                </div>
                <span className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-500 text-xs font-semibold rounded-full uppercase tracking-wider">
                  {filterLabel}
                </span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} allowDecimals={false} width={28} />
                    <RechartsTooltip
                      cursor={{ fill: '#f9fafb', radius: 8 }}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '13px' }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={52}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Links Panel */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-3">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Quick Access</h2>
              {cards.map((card, idx) => (
                <NavLink
                  key={idx}
                  to={card.path}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white bg-gradient-to-br ${card.gradient} shrink-0`}>
                    {card.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{card.title}</p>
                    <p className={`text-xs font-bold ${card.lightText}`}>{card.value} total</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                </NavLink>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
