import { NavLink, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import './edit-profile.css';
import { auth, db } from "../../firebase-config";
import { ref, get, update } from "firebase/database";

function EditProfile() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        contact: '',
        address: '',
        birthday: '',
        profileUrl: '',
    });

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            navigate("/login");
            return;
        }

        const userRef = ref(db, `users/${user.uid}`);
        get(userRef).then(snapshot => {
            if (snapshot.exists()) {
                setForm(snapshot.val());
            }
        });
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {

        // 🟩 **CONFIRMATION BEFORE SAVING**
        const confirmSave = window.confirm("Are you sure you want to save changes?");
        if (!confirmSave) return;

        const user = auth.currentUser;
        if (!user) return;

        setUploading(true);

        let profileUrl = form.profileUrl;

        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "my_upload_preset");

            try {
                const res = await fetch("https://api.cloudinary.com/v1_1/dzu1qb8oz/image/upload", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();

                if (!data.secure_url) throw new Error("Image upload failed");

                profileUrl = data.secure_url;
            } catch (err) {
                console.error(err);
                alert("Failed to upload image. Try again.");
                setUploading(false);
                return;
            }
        }

        const userRef = ref(db, `users/${user.uid}`);
        await update(userRef, { ...form, profileUrl });

        setUploading(false);
        alert("Profile updated successfully!");
        navigate("/accInfo");
    };

    return (
        <div className="editProfile-container">
            <div className="header-profile">
                <h1>Edit Profile</h1>
            </div>

            <div className="profile-box">
                <div className="profile-img-wrapper">
                    <img
                        src={form.profileUrl || "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"}
                        alt="Profile"
                        className="profile-img"
                    />
                    <label htmlFor="file-upload" className="upload-btn">Change</label>
                    <input id="file-upload" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </div>

                <label className="editProfile-label">First Name</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="profile-fields" />

                <label className="editProfile-label">Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="profile-fields" />

                <label className="editProfile-label">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="profile-fields" />

                <label className="editProfile-label">Contact Number</label>
                <input type="text" name="contact" value={form.contact} onChange={handleChange} className="profile-fields" />

                <label className="editProfile-label">Address</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} className="profile-fields" />

                <label className="editProfile-label">Birthdate</label>
                <input type="date" name="birthday" value={form.birthday} onChange={handleChange} className="profile-fields" />

                <div className="buttons">
                    <NavLink to="/accInfo"><button className="cancel">Cancel</button></NavLink>
                    <button className="save" onClick={handleSave} disabled={uploading}>
                        {uploading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;
