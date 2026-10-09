import "./TextCard.css";

export default function BannerCard({
    tag,
    title,
    children,
    isLoading = false,
    metaLeft,
    metaRight,
    className = "",
    style = {},
})

{
    return (
        <section
            className={`dash-banner ${isLoading ? "is-loading" : ""} ${className}`.trim()}
            style={style}
        >
            {isLoading ? (
            <div className="banner-loader-wrapper">
                <div className="loader" role="status" aria-label="Loading banner content" />
            </div>
            ) : (
            <>
                {tag && <div className="banner-tag">{tag}</div>}
                {title && <h2 className="banner-title">{title}</h2>}

                {children && <div className="banner-body">{children}</div>}

                {(metaLeft || metaRight) && (
                <div className="banner-meta">
                    <span>{metaLeft}</span>
                    <time>{metaRight}</time>
                </div>
                )}
            </>
            )}
        </section>
    );
}