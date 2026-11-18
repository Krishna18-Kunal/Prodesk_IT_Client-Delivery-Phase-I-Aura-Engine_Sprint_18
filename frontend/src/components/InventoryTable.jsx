import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);

function SortButton({ label, field, sort, onSort }) {
  const active = sort.replace('-', '') === field;
  const Icon = !active ? ArrowUpDown : sort.startsWith('-') ? ArrowDown : ArrowUp;
  return <button className="sort-button" onClick={() => onSort(active && !sort.startsWith('-') ? `-${field}` : field)}>{label}<Icon size={13} /></button>;
}

export default function InventoryTable({ products, sort, onSort, loading }) {
  return (
    <div className="table-scroll">
      <table>
        <thead><tr>
          <th><SortButton label="Product" field="productName" sort={sort} onSort={onSort} /></th>
          <th><SortButton label="SKU" field="sku" sort={sort} onSort={onSort} /></th>
          <th><SortButton label="Category" field="category" sort={sort} onSort={onSort} /></th>
          <th><SortButton label="Price" field="price" sort={sort} onSort={onSort} /></th>
          <th><SortButton label="Cost" field="cost" sort={sort} onSort={onSort} /></th>
          <th><SortButton label="Stock" field="stockQuantity" sort={sort} onSort={onSort} /></th>
          <th>Reorder at</th><th>Last updated</th>
        </tr></thead>
        <tbody>
          {loading ? <tr><td colSpan="8" className="table-message">Loading inventory…</td></tr>
            : products.length === 0 ? <tr><td colSpan="8" className="table-message">No products match these filters.</td></tr>
              : products.map((product) => <tr key={product._id}>
                <td className="product-name">{product.productName}</td><td className="sku">{product.sku}</td><td>{product.category}</td>
                <td>{money(product.price)}</td><td>{money(product.cost)}</td>
                <td><span className={`stock-pill ${product.stockQuantity <= product.reorderLevel ? 'low' : 'healthy'}`}>{product.stockQuantity}</span></td>
                <td>{product.reorderLevel}</td><td>{new Date(product.lastUpdated).toLocaleDateString()}</td>
              </tr>)}
        </tbody>
      </table>
    </div>
  );
}
