import { useMemo, useState } from "react";
import {
  FaSearch, FaPlus, FaEdit, FaTrash, FaPowerOff, FaTimes,
  FaBed, FaCheckCircle, FaBan, FaTags,
} from "react-icons/fa";
import { rooms as seedRooms, CATEGORIES, formatINR } from "../../data/rooms.js";
import { useNotify } from "../../context/NotificationContext.jsx";
import "./admin.css";

const catLabel = (key) => CATEGORIES.find((c) => c.key === key)?.label || key;

const blankRoom = () => ({
  id: "",
  name: "",
  category: "deluxe",
  size: 400,
  price: 15000,
  availableCount: 1,
  _originalAvail: 1,
  images: [],
});

export default function ManageRooms() {
  const { notify } = useNotify();
  const [list, setList] = useState(() =>
    seedRooms.map((r) => ({ ...r, _originalAvail: r.availableCount || 1 }))
  );
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [modal, setModal] = useState(null); // { mode:'add'|'edit', room }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((r) => {
      const okCat = cat === "all" || r.category === cat;
      const okQ = !q || r.name.toLowerCase().includes(q) || catLabel(r.category).toLowerCase().includes(q);
      return okCat && okQ;
    });
  }, [list, query, cat]);

  const stats = useMemo(() => {
    const total = list.length;
    const available = list.filter((r) => r.availableCount > 0).length;
    const soldOut = total - available;
    const avg = total ? Math.round(list.reduce((s, r) => s + r.price, 0) / total) : 0;
    return { total, available, soldOut, avg };
  }, [list]);

  const toggleAvail = (id) => {
    setList((l) =>
      l.map((r) => {
        if (r.id !== id) return r;
        const next = r.availableCount > 0 ? 0 : (r._originalAvail || 1);
        return { ...r, availableCount: next };
      })
    );
    const room = list.find((r) => r.id === id);
    notify(
      `${room?.name} ${room?.availableCount > 0 ? "marked sold out" : "made available"}`,
      "info"
    );
  };

  const removeRoom = (room) => {
    if (!window.confirm(`Delete "${room.name}"? This cannot be undone.`)) return;
    setList((l) => l.filter((r) => r.id !== room.id));
    notify(`${room.name} deleted`, "warning");
  };

  const saveModal = (form) => {
    if (modal.mode === "add") {
      const id = `room-${Date.now()}`;
      setList((l) => [
        { ...form, id, _originalAvail: Number(form.availableCount) || 1 },
        ...l,
      ]);
      notify(`${form.name} added`, "success");
    } else {
      setList((l) =>
        l.map((r) =>
          r.id === modal.room.id
            ? {
                ...r,
                name: form.name,
                price: Number(form.price),
                availableCount: Number(form.availableCount),
                _originalAvail: Number(form.availableCount) || r._originalAvail,
              }
            : r
        )
      );
      notify(`${form.name} updated`, "success");
    }
    setModal(null);
  };

  return (
    <div>
      <div className="admin-page-head">
        <h1>Manage Rooms</h1>
        <p>Add, edit, and control availability of every suite in the Royal collection.</p>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi">
          <span className="adm-kpi-ico"><FaBed /></span>
          <div className="kpi__label">Total Rooms</div>
          <div className="kpi__value">{stats.total}</div>
        </div>
        <div className="kpi">
          <span className="adm-kpi-ico"><FaCheckCircle /></span>
          <div className="kpi__label">Available</div>
          <div className="kpi__value">{stats.available}</div>
        </div>
        <div className="kpi">
          <span className="adm-kpi-ico"><FaBan /></span>
          <div className="kpi__label">Sold Out</div>
          <div className="kpi__value">{stats.soldOut}</div>
        </div>
        <div className="kpi">
          <span className="adm-kpi-ico"><FaTags /></span>
          <div className="kpi__label">Avg. Price</div>
          <div className="kpi__value">{formatINR(stats.avg)}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="adm-toolbar">
        <div className="adm-search">
          <FaSearch />
          <input
            placeholder="Search rooms…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="btn btn-gold btn-sm" onClick={() => setModal({ mode: "add", room: blankRoom() })}>
          <FaPlus /> Add Room
        </button>
      </div>

      <div className="adm-chips">
        <button className={`adm-chip ${cat === "all" ? "active" : ""}`} onClick={() => setCat("all")}>
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={`adm-chip ${cat === c.key ? "active" : ""}`}
            onClick={() => setCat(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="panel" style={{ marginTop: "1.4rem" }}>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Room</th><th>Category</th><th>Size</th>
                <th>Price / night</th><th>Available</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="adm-cell-room">
                      {r.images?.[0] && <img className="adm-thumb" src={r.images[0]} alt="" />}
                      <span className="adm-cell-room__name">{r.name}</span>
                    </div>
                  </td>
                  <td>{catLabel(r.category)}</td>
                  <td>{r.size ? `${r.size} sq.ft` : "—"}</td>
                  <td><span className="adm-price-edit">{formatINR(r.price)}</span></td>
                  <td>{r.availableCount}</td>
                  <td>
                    {r.availableCount > 0
                      ? <span className="badge badge-success">Available</span>
                      : <span className="badge badge-danger">Sold Out</span>}
                  </td>
                  <td>
                    <div className="adm-actions">
                      <button
                        className={`adm-iconbtn ${r.availableCount > 0 ? "on" : ""}`}
                        title="Toggle availability"
                        onClick={() => toggleAvail(r.id)}
                      ><FaPowerOff /></button>
                      <button
                        className="adm-iconbtn"
                        title="Edit"
                        onClick={() => setModal({ mode: "edit", room: r })}
                      ><FaEdit /></button>
                      <button
                        className="adm-iconbtn danger"
                        title="Delete"
                        onClick={() => removeRoom(r)}
                      ><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7}><div className="adm-empty">No rooms match your filters.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <RoomModal
          mode={modal.mode}
          room={modal.room}
          onClose={() => setModal(null)}
          onSave={saveModal}
        />
      )}
    </div>
  );
}

function RoomModal({ mode, room, onClose, onSave }) {
  const [form, setForm] = useState({
    name: room.name || "",
    category: room.category || "deluxe",
    price: room.price ?? 15000,
    availableCount: room.availableCount ?? 1,
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  };

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <form className="adm-modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="adm-modal__head">
          <h3>{mode === "add" ? "Add New Room" : "Edit Room"}</h3>
          <button type="button" className="adm-modal__close" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="adm-field">
          <label>Room Name</label>
          <input value={form.name} onChange={set("name")} placeholder="e.g. Deluxe Garden Room" autoFocus />
        </div>

        {mode === "add" && (
          <div className="adm-field">
            <label>Category</label>
            <select value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
        )}

        <div className="adm-field-row">
          <div className="adm-field">
            <label>Price / night (₹)</label>
            <input type="number" min="0" value={form.price} onChange={set("price")} />
          </div>
          <div className="adm-field">
            <label>Available count</label>
            <input type="number" min="0" value={form.availableCount} onChange={set("availableCount")} />
          </div>
        </div>

        <div className="adm-modal__foot">
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-gold btn-sm">
            {mode === "add" ? "Add Room" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
