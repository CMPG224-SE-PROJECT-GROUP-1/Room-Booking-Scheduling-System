import { useState } from "react";
import Card from "./Card";
import "./PhotoCard.css";

export default function PhotoCard({ photoLink, altText }) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80";
  const imageSrc = photoLink || fallbackImage;
  const imageAlt = altText || "Room view";

  return (
    <>
      <Card className="picture-card">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="full-image expandable-pic"
          onClick={() => setIsViewerOpen(true)}
          title="Click to expand"
        />
      </Card>

      {/* Picture Viewer Modal */}
      {isViewerOpen && (
        <div
          className="picture-viewer-modal"
          onClick={() => setIsViewerOpen(false)}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className="expanded-image"
          />
          <span className="close-viewer-label">Click anywhere to close</span>
        </div>
      )}
    </>
  );
}