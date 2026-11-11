import './report-card.css';

function ReportCard({ item, location, date, description, status, imageUrl }) {
    return (
        <div className="report-card">
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={item}
                    className="report-image"
                />
            )}
            <div className="report-info">
                <h4>{item}</h4>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Date:</strong> {date}</p>
                <p><strong>Status:</strong> {status}</p>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default ReportCard;
