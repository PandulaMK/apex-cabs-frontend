import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "../admin/adminTable.css";

const money = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

export default function OwnerPayments() {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${d.getFullYear()}-${mm}`; // YYYY-MM
  });

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/owner/payments?month=${encodeURIComponent(month)}`);
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [month]);

  // ✅ totals row
  const totals = useMemo(() => {
    return rows.reduce(
      (acc, r) => {
        acc.bookings += Number(r.bookings_count || 0);
        acc.gross += Number(r.gross_amount || 0);
        acc.owner += Number(r.owner_amount || 0);
        acc.company += Number(r.company_amount || 0);
        acc.payout += Number(r.payout_amount || 0);
        return acc;
      },
      { bookings: 0, gross: 0, owner: 0, company: 0, payout: 0 }
    );
  }, [rows]);

  return (
    <div>
      <h1>Payments</h1>

      <div className="admin-search" style={{ display: "flex", gap: 10 }}>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{ maxWidth: 220 }}
        />
        <button type="button" onClick={load} disabled={loading}>
          {loading ? "..." : "Refresh"}
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Vehicle No.</th>
              <th>Vehicle</th>
              <th>Daily Rate</th>
              <th>Bookings</th>
              <th>Gross</th>
              <th>Owner 85%</th>
              <th>Company 15%</th>
              <th>Payout (Admin)</th>
              <th>Status</th>
              <th>Paid At</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center", padding: 18 }}>
                  {loading ? "Loading..." : "No payment records"}
                </td>
              </tr>
            ) : (
              <>
                {rows.map((r) => (
                  <tr key={r.vehicle_id}>
                    <td>{r.vehicle_number}</td>
                    <td>{r.title}</td>

                    <td>{r.daily_rate ? money(r.daily_rate) : "—"}</td>

                    <td>{r.bookings_count || 0}</td>

                    <td>{money(r.gross_amount)}</td>

                    <td style={{ fontWeight: 900 }}>{money(r.owner_amount)}</td>

                    <td>{money(r.company_amount)}</td>

                    <td>{r.payout_amount != null ? money(r.payout_amount) : "—"}</td>

                    <td>
                      <span
                        className={`status-badge ${String(r.payout_status || "pending").toLowerCase()}`}
                      >
                        {r.payout_status || "pending"}
                      </span>
                    </td>

                    <td>{r.paid_at ? new Date(r.paid_at).toLocaleString() : "—"}</td>
                  </tr>
                ))}

                {/* ✅ totals row */}
                <tr className="totals-row">
                  <td colSpan={3} style={{ fontWeight: 900 }}>
                    Totals
                  </td>
                  <td style={{ fontWeight: 900 }}>{totals.bookings}</td>
                  <td style={{ fontWeight: 900 }}>{money(totals.gross)}</td>
                  <td style={{ fontWeight: 900 }}>{money(totals.owner)}</td>
                  <td style={{ fontWeight: 900 }}>{money(totals.company)}</td>
                  <td style={{ fontWeight: 900 }}>{money(totals.payout)}</td>
                  <td colSpan={2}></td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}