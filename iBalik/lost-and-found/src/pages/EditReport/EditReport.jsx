import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import "./edit-report.css";
import { auth, db } from "../../firebase-config";
import { ref, update } from "firebase/database";
import { NavLink } from "react-router";

function EditReport() {
    const location = useLocation();
    const navigate = useNavigate();
    const report = location.state?.report;

    if (!report) {
        navigate("/accInfo");
        return null;
    }

    const [form, setForm] = useState({
        item: report.item,
        location: report.location,
        date: report.date,
        description: report.description || "", // optional
        status: report.status,
        file: null,
        imageUrl: report.imageUrl || ""
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [maxDate, setMaxDate] = useState("");

    useEffect(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        setMaxDate(`${yyyy}-${mm}-${dd}`);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setForm(prev => ({ ...prev, file }));
        setErrors(prev => ({ ...prev, file: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.item.trim()) newErrors.item = "Item is required";
        if (!form.location.trim()) newErrors.location = "Location is required";
        if (!form.date) newErrors.date = "Date is required";
        if (!form.status) newErrors.status = "Status is required";
        if (!form.imageUrl && !form.file) newErrors.file = "Image is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "my_upload_preset");

        const res = await fetch("https://api.cloudinary.com/v1_1/dzu1qb8oz/image/upload", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        if (!data.secure_url) throw new Error("Image upload failed");
        return data.secure_url;
    };

    const handleSave = async () => {
        if (!validate()) return;

        const confirmUpdate = window.confirm("Are you sure you want to update this report?");
        if (!confirmUpdate) return;

        setSaving(true);

        try {
            let imageUrl = form.imageUrl;

            if (form.file) {
                imageUrl = await uploadToCloudinary(form.file);
            }

            const user = auth.currentUser;
            if (!user) return;

            const reportRef = ref(db, `reports/${user.uid}/${report.id}`);
            await update(reportRef, {
                item: form.item,
                location: form.location,
                date: form.date,
                description: form.description,
                status: form.status,
                imageUrl
            });

            alert("Report updated successfully!");
            navigate("/accInfo");

        } catch (err) {
            console.error(err);
            alert("Error updating report: " + err.message);
        }

        setSaving(false);
    };

    return (
        <div className="edit-report-container">
            <div className="header-edit-report"><h1>Edit Report</h1></div>

            <div className="edit-report-form">
                <img
                    src={form.imageUrl || "https://via.placeholder.com/150"}
                    alt="Report"
                    style={{ width: "150px", height: "150px", borderRadius: "10px", objectFit: "cover" }}
                />

                <input type="file" onChange={handleFileChange} />

                <label className="editReport-label">Item</label>
                <input type="text" name="item" value={form.item} onChange={handleChange} />
                {errors.item && <p className="error-text">{errors.item}</p>}

                <label className="editReport-label">Location</label>
                <input type="text" name="location" value={form.location} onChange={handleChange} />
                {errors.location && <p className="error-text">{errors.location}</p>}

                <label className="editReport-label">Date</label>
                <input type="date" name="date" max={maxDate} value={form.date} onChange={handleChange} />
                {errors.date && <p className="error-text">{errors.date}</p>}

                <label className="editReport-label">Description (optional)</label>
                <textarea name="description" value={form.description} onChange={handleChange} />

                <label className="editReport-label">Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                    <option value="">Select Status</option>
                    <option value="Found">Found</option>
                    <option value="Still Missing">Still Missing</option>
                    <option value="Lost">Lost</option>
                </select>
                {errors.status && <p className="error-text">{errors.status}</p>}

              
                <div className="buttons">
                    <NavLink to="/accInfo">
                        <button className="cancelBtn" disabled={saving}>Cancel</button>
                    </NavLink>

                    <button className="updateBtn" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditReport;
