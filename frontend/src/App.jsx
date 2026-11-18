import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, Boxes, CircleAlert, Download, PackageSearch, RefreshCw, Search, TrendingUp } from 'lucide-react';
import KpiCard from './components/KpiCard.jsx';
import Analytics from './components/Analytics.jsx';
import InventoryTable from './components/InventoryTable.jsx';
import { apiRequest, inventoryUrl } from './services/api.js';
import { useDebouncedValue } from './hooks/useDebouncedValue.js';

const PAGE_SIZE = 50;
const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);

export default function App() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 500);
  const [category, setCategory] = useState('');
  const [maxStock, setMaxStock] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('-lastUpdated');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ totalRecords: 0, totalPages: 0, currentPage: 1, hasNextPage: false });
  const [categories, setCategories] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const filters = useMemo(() => ({
    search: debouncedSearch, category, maxStock, minPrice, maxPrice, sort,
  }), [debouncedSearch, category, maxStock, minPrice, maxPrice, sort]);

  const loadInventory = useCallback(async (signal) => {
    setLoading(true);
    setError('');
    try {
      const result = await apiRequest(inventoryUrl({ ...filters, page, limit: PAGE_SIZE }), { signal });
      setProducts(result.data);
      setPagination(result.pagination);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    const controller = new AbortController();
    loadInventory(controller.signal);
    return () => controller.abort();
  }, [loadInventory]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      apiRequest('/inventory/categories', { signal: controller.signal }),
      apiRequest('/analytics', { signal: controller.signal }),
    ]).then(([categoryResult, analyticsResult]) => {
      setCategories(categoryResult.data);
      setAnalytics(analyticsResult.data);
    }).catch((err) => {
      if (err.name !== 'AbortError') setError(err.message);
    });
    return () => controller.abort();
  }, []);

  const exportCsv = async () => {
    setExporting(true);
    try {
      const allRows = [];
      let currentPage = 1;
      let totalPages = 1;
      do {
        const result = await apiRequest(inventoryUrl({ ...filters, page: currentPage, limit: 1000 }));
        allRows.push(...result.data);
        totalPages = result.pagination.totalPages;
        currentPage += 1;
      } while (currentPage <= totalPages);
      const columns = ['productName', 'sku', 'category', 'price', 'cost', 'stockQuantity', 'reorderLevel', 'lastUpdated'];
      const escapeCsv = (value) => {
        const text = value == null ? '' : String(value);
        return `"${text.replaceAll('"', '""')}"`;
      };
      const csv = [columns.join(','), ...allRows.map((row) => columns.map((key) => escapeCsv(row[key])).join(','))].join('\r\n');
      const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `aura-inventory-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(`CSV export failed: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Activity size={22} /></div><div><strong>AURA</strong><span>ENTERPRISE ENGINE</span></div></div>
        <div className="nav-label">WORKSPACE</div>
        <div className="nav-item active"><Boxes size={17} /> Inventory Overview</div>
        <div className="nav-item"><TrendingUp size={17} /> Analytics</div>
        <div className="sidebar-bottom"><span className="status-dot" /> Systems operational <small>Inventory engine · MVP</small></div>
      </aside>

      <section className="main-content">
        <header className="topbar"><div><span className="eyebrow">OPERATIONS / INVENTORY</span><h1>Command Center</h1></div><div className="topbar-right"><span className="live-indicator"><i /> LIVE DATA</span><div className="avatar">AH</div></div></header>
        <div className="page-content">
          <div className="welcome-row"><div><h2>Inventory intelligence</h2><p>Monitor stock health, portfolio value, and replenishment priorities.</p></div><button className="secondary-button" onClick={() => window.location.reload()}><RefreshCw size={15} /> Refresh</button></div>

          <section className="kpi-grid">
            <KpiCard label="Total SKUs" value={(analytics?.summary.totalSkus || 0).toLocaleString()} hint="Distinct inventory products" icon={PackageSearch} />
            <KpiCard label="Inventory valuation" value={money(analytics?.summary.totalInventoryValue)} hint="Price × available stock" icon={TrendingUp} />
            <KpiCard label="Out of stock" value={(analytics?.summary.outOfStockItems || 0).toLocaleString()} hint="Products with zero units" icon={CircleAlert} />
          </section>

          {analytics && <Analytics analytics={analytics} />}

          <section className="panel inventory-panel">
            <div className="panel-heading inventory-heading"><div><p className="eyebrow">PRODUCT CATALOG</p><h2>All inventory <span className="record-count">{pagination.totalRecords.toLocaleString()} records</span></h2></div><button className="primary-button" onClick={exportCsv} disabled={exporting || pagination.totalRecords === 0}><Download size={15} />{exporting ? 'Preparing CSV…' : 'Export CSV'}</button></div>
            <div className="filter-toolbar">
              <label className="search-box"><Search size={17} /><input value={search} onChange={(e) => changeFilter(setSearch)(e.target.value)} placeholder="Search product, SKU or category…" /><kbd>500ms</kbd></label>
              <label className="filter-field"><span>Category</span><select value={category} onChange={(e) => changeFilter(setCategory)(e.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="filter-field"><span>Max stock: {maxStock === '' ? 'Any' : maxStock}</span><input type="range" min="0" max="100" step="1" value={maxStock === '' ? 100 : maxStock} onChange={(e) => changeFilter(setMaxStock)(e.target.value === '100' ? '' : e.target.value)} /></label>
              <div className="price-filter"><span>Price range ($)</span><div><input aria-label="Minimum price" type="number" min="0" placeholder="Min" value={minPrice} onChange={(e) => changeFilter(setMinPrice)(e.target.value)} /><input aria-label="Maximum price" type="number" min="0" placeholder="Max" value={maxPrice} onChange={(e) => changeFilter(setMaxPrice)(e.target.value)} /></div></div>
            </div>
            {error && <div className="error-banner">{error}</div>}
            <InventoryTable products={products} sort={sort} onSort={(value) => { setSort(value); setPage(1); }} loading={loading} />
            <div className="table-footer"><span>Showing {pagination.totalRecords === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, pagination.totalRecords)} of {pagination.totalRecords.toLocaleString()}</span><div className="pagination"><button disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)}>Previous</button><span>Page {page} of {Math.max(pagination.totalPages, 1)}</span><button disabled={!pagination.hasNextPage || loading} onClick={() => setPage((value) => value + 1)}>Next</button></div></div>
          </section>
          <footer>© {new Date().getFullYear()} Aura Engine · Synthetic demonstration data · Secure client delivery MVP</footer>
        </div>
      </section>
    </main>
  );
}
