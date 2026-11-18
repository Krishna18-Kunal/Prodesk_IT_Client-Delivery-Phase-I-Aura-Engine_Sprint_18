import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#6d8cff', '#25c2a0', '#f4b860', '#d879e8', '#ff7b72', '#63b3ed', '#a3a3a3', '#b7d36b', '#f08c46', '#8b9cf7'];
const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);

export default function Analytics({ analytics }) {
  const priority = analytics?.restockPriority || [];
  const categories = analytics?.categoryValuation || [];
  return (
    <section className="analytics-grid">
      <article className="panel chart-panel">
        <div className="panel-heading"><div><p className="eyebrow">INVENTORY RISK</p><h2>Restock priority</h2></div><span className="chart-note">10 lowest stock items</span></div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priority} margin={{ top: 12, right: 8, left: -18, bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#263248" />
              <XAxis dataKey="sku" angle={-35} textAnchor="end" interval={0} tick={{ fill: '#91a0b8', fontSize: 10 }} />
              <YAxis allowDecimals={false} tick={{ fill: '#91a0b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111b2c', border: '1px solid #2a3952', borderRadius: 10 }} />
              <Bar dataKey="stockQuantity" name="Units in stock" fill="#f4b860" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
      <article className="panel chart-panel">
        <div className="panel-heading"><div><p className="eyebrow">PORTFOLIO MIX</p><h2>Inventory valuation</h2></div><span className="chart-note">By category</span></div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categories} dataKey="totalValuation" nameKey="category" cx="50%" cy="46%" innerRadius={58} outerRadius={92} paddingAngle={3}>
                {categories.map((entry, index) => <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => money(value)} contentStyle={{ background: '#111b2c', border: '1px solid #2a3952', borderRadius: 10 }} />
              <Legend verticalAlign="bottom" height={42} wrapperStyle={{ color: '#aebbd0', fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
