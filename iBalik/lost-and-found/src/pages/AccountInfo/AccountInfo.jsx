import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import './account-info.css';
import { auth, db } from "../../firebase-config";
import { ref, get, remove } from "firebase/database";

function AccountInfo() {
    const [userData, setUserData] = useState();
    const [reports, setReports] = useState([]);
    const [visibleActions, setVisibleActions] = useState(null);
    const navigate = useNavigate();

    const toggleActions = (id) => {
        setVisibleActions(prev => (prev === id ? null : id));
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (!user) {
                navigate("/login");
                return;
            }

            // Fetch user info
            const userRef = ref(db, `users/${user.uid}`);
            const userSnap = await get(userRef);
            if (userSnap.exists()) setUserData(userSnap.val());

            // Fetch user reports
            const reportsRef = ref(db, `reports/${user.uid}`);
            const reportsSnap = await get(reportsRef);
            if (reportsSnap.exists()) {
                const data = reportsSnap.val();
                const list = Object.keys(data).map(key => ({
                    id: key,
                    userId: user.uid,
                    ...data[key]
                }));
                setReports(list);
            }
        };

        fetchUserData();
    }, [navigate]);

    const editReport = (report) => {
        navigate("/editReport", { state: { report } });
    };

    const deleteReport = (reportId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this report?");
    if (!confirmDelete) return;

    const user = auth.currentUser;
    if (!user) return;

    const reportRef = ref(db, `reports/${user.uid}/${reportId}`);
    remove(reportRef).then(() => {
        setReports(prev => prev.filter(r => r.id !== reportId));
        alert("Report deleted successfully!"); // ✅ Show success message
    }).catch((err) => {
        console.error(err);
        alert("Failed to delete report. Please try again.");
    });
};


    return (
        <div className="acc-info-container">

            <div className="info-box">
                <img
                    src={userData?.profileUrl || "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"}
                    alt="Profile"
                />
                <div className="user-details">
                    <h4>{userData ? `${userData.firstName} ${userData.lastName}` : "Loading..."}</h4>
                    <div className="detail-row"><span>Email:</span> <p>{userData?.email}</p></div>
                    <div className="detail-row"><span>Contact:</span> <p>{userData?.contact}</p></div>
                    <div className="detail-row"><span>Address:</span> <p>{userData?.address}</p></div>
                    <div className="detail-row"><span>Birthday:</span> <p>{userData?.birthday}</p></div>
                </div>

                <i className="fa-regular fa-pen-to-square" onClick={() => navigate("/editProfile")}></i>
            </div>

            <div className="my-reports">
                <h2>My Reports</h2>
                {reports.length === 0 && <p>No reports yet.</p>}
                {reports.map(report => (
                    <div className="report-card" key={report.id}>

                        {/* Report image */}
                        {report.imageUrl && (
                            <img
                                src={report.imageUrl}
                                alt={report.item}
                                className="report-image"
                            />
                        )}

                        <div className="report-info">
                            <h4>{report.item}</h4>
                            <p><strong>Status:</strong> {report.status}</p>
                            <p><strong>Date:</strong> {report.date}</p>
                        </div>

                        <div className="report-actions">
                            {visibleActions === report.id ? (
                                <div className="action-buttons">
                                    <button className="action-btn" onClick={() => editReport(report)}>Edit</button>
                                    <button className="action-btn" onClick={() => deleteReport(report.id)}>Delete</button>
                                </div>
                            ) : (
                                <button className="dots-btn" onClick={() => toggleActions(report.id)}>⋮</button>
                            )}
                        </div>

                    </div>
                ))}
            </div>

            <NavLink to="/submitReport">
                <button className="floating-add-btn">
                    <i className="fa-solid fa-plus"></i>
                </button>
            </NavLink>
        </div>
    );
}

export default AccountInfo;
