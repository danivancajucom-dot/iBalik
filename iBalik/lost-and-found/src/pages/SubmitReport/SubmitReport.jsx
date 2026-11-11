import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import "./submit-report.css";
import { auth, db } from "../../firebase-config";
import { ref, push } from "firebase/database";

function SubmitReport() {
    const [item, setItem] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState(""); // optional
    const [status, setStatus] = useState("");
    const [file, setFile] = useState(null);
    const [saving, setSaving] = useState(false);

    const [errors, setErrors] = useState({
        item: "",
        location: "",
        date: "",
        description: "",
        status: "",
        file: ""
    });

    const navigate = useNavigate();

    // ================== FIELD VALIDATIONS ==================
    function validateItem(e) {
        const value = e.target.value.trim();
        setErrors(prev => ({ ...prev, item: "" }));

        if (!value) {
            setErrors(prev => ({ ...prev, item: "Item is required." }));
            setItem("");
        } else {
            setItem(value);
        }
    }

    function validateLocation(e) {
        const value = e.target.value.trim();
        setErrors(prev => ({ ...prev, location: "" }));

        if (!value) {
            setErrors(prev => ({ ...prev, location: "Location field is required." }));
            setLocation("");
        } else {
            setLocation(value);
        }
    }

    function validateDate(e) {
        const value = e.target.value;
        setErrors(prev => ({ ...prev, date: "" }));

        if (!value) {
            setErrors(prev => ({ ...prev, date: "Date field is required." }));
            setDate("");
        } else {
            setDate(value);
        }
    }

    function validateDescription(e) {
        const value = e.target.value.trim();
        setErrors(prev => ({ ...prev, description: "" }));
        setDescription(value); // optional
    }

    function validateStatus(e) {
        const value = e.target.value;
        setErrors(prev => ({ ...prev, status: "" }));

        if (!value) {
            setErrors(prev => ({ ...prev, status: "Status field is required." }));
            setStatus("");
        } else {
            setStatus(value);
        }
    }

    function validateImage(e) {
        const f = e.target.files[0];
        setErrors(prev => ({ ...prev, file: "" }));

        if (!f) {
            setErrors(prev => ({ ...prev, file: "Image required." }));
            setFile(null);
            return;
        }

        if (!f.type.startsWith("image/")) {
            setErrors(prev => ({ ...prev, file: "Invalid image file." }));
            setFile(null);
            return;
        }

        setFile(f);
    }

    async function validateSubmission() {
        const missing = [];

        if (!item) missing.push("Item");
        if (!location) missing.push("Location");
        if (!date) missing.push("Date");
        if (!status) missing.push("Status");
        if (!file) missing.push("Image");

        if (missing.length > 1) {
            alert("Please fill all required fields!");
            return false;
        }

        if (missing.length === 1) {
            alert(`${missing[0]} field is required!`);
            return false;
        }

        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const ok = await validateSubmission();
        if (!ok) return;

        const userConfirm = confirm("Are you sure this information is correct?");
        if (!userConfirm) return;

        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to submit.");
            navigate("/login");
            return;
        }

        setSaving(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "my_upload_preset");

            const res = await fetch("https://api.cloudinary.com/v1_1/dzu1qb8oz/image/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!data.secure_url) throw new Error("Cloudinary upload failed.");

            await push(ref(db, `reports/${user.uid}`), {
                item,
                location,
                date,
                description,
                status,
                imageUrl: data.secure_url,
            });

            alert("Report submitted successfully!");
            navigate("/accInfo");

        } catch (err) {
            alert("Error: " + err.message);
        }

        setSaving(false);
    };

    return (
        <div className="submit-report-container">
            <h1>Submit Report</h1>

            {/* Scrollable Form Wrapper */}
            <div className="submit-report-form-wrapper">
                <form className="submit-report-form" onSubmit={handleSubmit}>

                    <label>Item</label>
                    <input type="text" onChange={validateItem} />
                    <p className="error-text">{errors.item}</p>

                    <label>Location</label>
                    <input type="text" onChange={validateLocation} />
                    <p className="error-text">{errors.location}</p>

                    <label>Date</label>
                    <input type="date" max={new Date().toISOString().split("T")[0]} onChange={validateDate} />
                    <p className="error-text">{errors.date}</p>

                    <label>Description (Optional)</label>
                    <textarea className="description" onChange={validateDescription}></textarea>
                    <p className="error-text">{errors.description}</p>

                    <label>Status</label>
                    <select onChange={validateStatus}>
                        <option value="">Select Status</option>
                        <option value="Found">Found</option>
                        <option value="Still Missing">Still Missing</option>
                        <option value="Lost">Lost</option>
                    </select>
                    <p className="error-text">{errors.status}</p>

                    <label>Item Image</label>
                    <input type="file" accept="image/*" onChange={validateImage} />
                    <p className="error-text">{errors.file}</p>

                    <div className="buttons">
                        <NavLink to="/accInfo">
                            <button type="button" className="cancelBtn" disabled={saving}>Cancel</button>
                        </NavLink>

                        <button type="submit" className="submitBtn" disabled={saving}>
                            {saving ? "Submitting..." : "Submit Report"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SubmitReport;
