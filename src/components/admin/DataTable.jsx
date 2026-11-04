
import { ChevronLeft, ChevronRight, Search, Loader2, ArrowUpDown } from 'lucide-react';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  totalCount = 0,
  totalPages = 1,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  actions,
  emptyMessage = 'No records found.',
  onSort,
  sortBy,
  /* sortOrder */
}) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r-lg, 28px)',
        boxShadow: 'var(--shadow-raised)',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.6)',
      }}
    >
      {/* Table Header Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}
      >
        {onSearchChange && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--surface)',
              borderRadius: 'var(--r-pill, 999px)',
              boxShadow: 'var(--shadow-inset-sm)',
              padding: '0.4rem 1rem',
              minWidth: '240px',
              maxWidth: '380px',
              flex: '1',
            }}
          >
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                color: 'var(--text)',
                width: '100%',
                fontSize: '0.9rem',
              }}
            />
          </div>
        )}

        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
            {actions}
          </div>
        )}
      </div>

      {/* Table Responsive Wrapper */}
      <div style={{ overflowX: 'auto', minHeight: '200px' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid var(--divider)' }}>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                  style={{
                    padding: '0.75rem 1rem',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    {col.header}
                    {col.sortable && (
                      <ArrowUpDown
                        size={12}
                        color={sortBy === col.key ? 'var(--accent)' : 'var(--text-muted)'}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Loader2 size={28} className="animate-spin" color="var(--accent)" />
                    <span>Loading records...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.95rem',
                  }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  style={{
                    borderBottom: '1px solid var(--divider)',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key || colIdx}
                      style={{
                        padding: '0.85rem 1rem',
                        fontSize: '0.9rem',
                        color: 'var(--text)',
                        borderBottom: '1px solid var(--divider)',
                        whiteSpace: col.wrap ? 'normal' : 'nowrap',
                      }}
                    >
                      {col.render ? col.render(row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '1.25rem',
          marginTop: '0.5rem',
          borderTop: '1px solid var(--divider)',
          gap: '1rem',
        }}
      >
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing {data.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
          {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            disabled={currentPage <= 1 || loading}
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--r-sm)',
              border: 'none',
              background: 'var(--surface)',
              boxShadow: currentPage <= 1 ? 'none' : 'var(--shadow-raised-sm)',
              color: currentPage <= 1 ? 'var(--text-muted)' : 'var(--text)',
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.85rem',
              opacity: currentPage <= 1 ? 0.6 : 1,
            }}
          >
            <ChevronLeft size={16} /> Prev
          </button>

          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)', padding: '0 0.5rem' }}>
            {currentPage} / {Math.max(1, totalPages)}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages || loading}
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--r-sm)',
              border: 'none',
              background: 'var(--surface)',
              boxShadow: currentPage >= totalPages ? 'none' : 'var(--shadow-raised-sm)',
              color: currentPage >= totalPages ? 'var(--text-muted)' : 'var(--text)',
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.85rem',
              opacity: currentPage >= totalPages ? 0.6 : 1,
            }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
