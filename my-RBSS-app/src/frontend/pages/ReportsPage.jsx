import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import TextCard from "../components/TextCard";
import { ReportGenerator } from "../../backend/ReportGenerator";
import "./Dashboard.css";

// default: the last 30 days
const todayStr = new Date().toISOString().slice(0, 10);
const monthAgoStr = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

export default function ReportsPage() {
  const [from, setFrom] = useState(monthAgoStr);
  const [to, setTo] = useState(todayStr);
  const [rows, setRows] = useState([]);
  const [generated, setGenerated] = useState(null);   // the ReportGenerator used for the current rows
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  async function handleGenerate() {
    setErrorMsg(null);
    setLoading(true);
    try {
      const generator = new ReportGenerator("Booking summary report", { from, to });
      const data = await generator.generate();
      setRows(data);
      setGenerated(generator);
    } catch (err) {
      setErrorMsg(err.message || "Could not generate the report.");
    } finally {
      setLoading(false);
    }
  }

  const total = (key) => rows.reduce((sum, r) => sum + Number(r[key] || 0), 0);

  return (
    <div className="app-frame">
      <TextCard
        tag="Reports"
        title="Booking Reports"
        metaLeft="ADMIN & MANAGER"
        metaRight=""
      >
        <p>Choose a date range, generate the summary, then export it.</p>
      </TextCard>

      <div className="home-body">
        <main className="home-main">
          {errorMsg && <div className="dashboard-error-banner">{errorMsg}</div>}

          <Card className="booking-card">
            <label>From <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
            <label>To <input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
            <Button variant="solid" disabled={loading} onClick={handleGenerate}>
              {loading ? "Generating..." : "Generate report"}
            </Button>
          </Card>

          {generated && rows.length === 0 && (
            <Card className="empty-state-card"><p>No bookings found for these dates.</p></Card>
          )}

          {rows.length > 0 && (
            <>
              <table className="schedule">
                <thead>
                  <tr>
                    <th>Building</th><th>Room</th><th>Total</th><th>Checked in</th><th>Cancelled</th><th>No-shows</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={`${r.building}-${r.room_number}`}>
                      <td>{r.building}</td><td>{r.room_number}</td>
                      <td>{r.total_bookings}</td><td>{r.checked_in}</td>
                      <td>{r.cancelled}</td><td>{r.no_shows}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={2}><b>Total</b></td>
                    <td><b>{total("total_bookings")}</b></td><td><b>{total("checked_in")}</b></td>
                    <td><b>{total("cancelled")}</b></td><td><b>{total("no_shows")}</b></td>
                  </tr>
                </tbody>
              </table>

              <div className="btn-row">
                <Button variant="outline" onClick={() => generated.exportCSV(rows)}>Export CSV</Button>
                <Button variant="solid" onClick={() => generated.exportPDF(rows)}>Export PDF</Button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}