import { useEffect, useState } from "react";
import './dashboard.css';
import { auth, db } from "../../firebase-config";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router";
import ViewReport from "../ViewReport/ViewReport";
import ReportCard from "../../components/ReportCard/ReportCard";

function Dashboard() {
    const [userData, setUserData] = useState();
    const [allReports, setAllReports] = useState([]);
       const [filteredReports, setFilteredReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = () => {
            const user = auth.currentUser;
            if (!user) {
                navigate("/login");
                return;
            }

            // Fetch user profile
            const userRef = ref(db, `users/${user.uid}`);
            get(userRef).then(snapshot => {
                if (snapshot.exists()) setUserData(snapshot.val());
            });

            // Fetch all reports
            const reportsRef = ref(db, `reports`);
            get(reportsRef).then(snapshot => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const list = [];

                    // Gather all reports from all users
                    for (let userId in data) {
                        for (let reportId in data[userId]) {
                            list.push({ id: reportId, userId, ...data[userId][reportId] });
                        }
                    }

                    // 🔥 Remove any “Claimed” reports (old data cleanup)
                    const cleaned = list.filter(r =>
                        r.status === "Found" ||
                        r.status === "Still Missing" ||
                        r.status === "Lost"
                    );

                    setAllReports(cleaned);
                    setFilteredReports(cleaned);
                }
            });
        };

        fetchData();
    }, [navigate]);

    const openReport = (report) => setSelectedReport(report);
    const closeReport = () => setSelectedReport(null);

    // Search filter
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = allReports.filter(report =>
            report.item.toLowerCase().includes(query) ||
            report.location.toLowerCase().includes(query) ||
            report.status.toLowerCase().includes(query)  // only three statuses now
        );

        setFilteredReports(filtered);
    };

    const handleReportUpdate = (updatedReport) => {
        setAllReports(prev =>
            prev.map(r => (r.id === updatedReport.id && r.userId === updatedReport.userId ? updatedReport : r))
        );
        setFilteredReports(prev =>
            prev.map(r => (r.id === updatedReport.id && r.userId === updatedReport.userId ? updatedReport : r))
        );
        setSelectedReport(updatedReport);
    };

    return (
        <div className="dashboard-container">

            <div className="header">
                <h1>Hello, {userData ? userData.firstName : "KaBarangay"}!</h1>
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search by item, location, or status..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            <div className="status-box">
                <img
                    src={userData?.profileUrl || "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"}
                    alt="Profile"
                />
                <div className="status-details">
                    <h4>Have you lost or found something today?</h4>
                    <p>Keep track of your items and reports with iBalik.</p>
                </div>
            </div>

            <div className="report-section">
                <h2>All Reports</h2>
                <div className="report-list">

                    {filteredReports.length === 0 && <p>No reports match your search.</p>}

                    {filteredReports.map(report => (
                        <div key={report.id} onClick={() => openReport(report)}>
                            <ReportCard 
                                item={report.item}
                                location={report.location}
                                date={report.date}
                                status={report.status}
                                description={report.description}
                                imageUrl={report.imageUrl}
                            />
                        </div>
                    ))}

                </div>
            </div>

            {selectedReport && (
                <ViewReport
                    report={selectedReport}
                    closeReport={closeReport}
                    onSave={handleReportUpdate}
                />
            )}

        </div>
    );
}

export default Dashboard;
