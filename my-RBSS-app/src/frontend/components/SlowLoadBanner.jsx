import { Link } from "react-router-dom";

// Shown by pages when loading takes longer than 15 seconds
export default function SlowLoadBanner() {
    return (
        <div className="dashboard-error-banner">
            This is taking longer than expected.{" "}
            <Link to="/dashboard">Go back to the homepage</Link>
            {" or "}
            <button type="button" onClick={() => window.location.reload()}>reload the page</button>.
        </div>
    );
}