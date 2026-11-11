import { useState, useEffect } from "react";
import { ref, update, get } from "firebase/database";
import { db } from "../../firebase-config";
import './view-report.css';

function ViewReport({ report, closeReport, onSave }) {
  const [status, setStatus] = useState(report.status || "");
  const [saving, setSaving] = useState(false);
  const [reporterName, setReporterName] = useState("");

  useEffect(() => {
    const fetchReporterName = async () => {
      if (!report.userId) return;

      try {
        const userRef = ref(db, `users/${report.userId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setReporterName(`${userData.firstName} ${userData.lastName}`);
        } else {
          setReporterName("Unknown User");
        }
      } catch (err) {
        console.error("Error fetching reporter:", err);
        setReporterName("Unknown User");
      }
    };

    fetchReporterName();
  }, [report.userId]);

  const saveStatus = async () => {
  if (!report.userId || !report.id) {
    alert("Cannot save: missing report info");
    return;
  }

  if (!status) {
    alert("Please select a status before saving.");
    return;
  }

  // ✅ Confirmation before saving
  const confirmSave = window.confirm("Are you sure you want to update the status?");
  if (!confirmSave) return;

  setSaving(true);
  try {
    const reportRef = ref(db, `reports/${report.userId}/${report.id}`);
    await update(reportRef, { status });

    const updatedReport = { ...report, status };
    if (onSave) onSave(updatedReport);

    alert("Status updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to update status. Try again.");
  }
  setSaving(false);
};

  // 🔥 FIXED: Removed "Claimed" entirely.
  const statusOptions = ["Found", "Still Missing", "Lost"];

  return (
    <div className="view-report-overlay">
      <div className="view-report-container">
        <h2>Report Details</h2>

        {/* Report Image */}
        {report.imageUrl && (
          <img
            src={report.imageUrl}
            alt={report.item}
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              borderRadius: "10px",
              marginBottom: "15px"
            }}
          />
        )}

        <p><strong>Item:</strong> {report.item}</p>
        <p><strong>Location:</strong> {report.location}</p>
        <p><strong>Date:</strong> {report.date}</p>

        <p>
          <strong>Status:</strong>{" "}
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </p>

        <p><strong>Description:</strong> {report.description}</p>
        <p><strong>Reported by:</strong> {reporterName}</p>

        <div className="report-buttons">
          <button onClick={closeReport} className="close-btn">Close</button>
          <button onClick={saveStatus} disabled={saving} className="save-btn">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewReport;
