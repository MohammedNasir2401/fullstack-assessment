function StatCard({ label, subtitle, value }: { label: string; subtitle: string; value: number }) {
    const color =
        value > 0 ? "green" : value < 0 ? "red" : "gray";

    return (
        <div
            style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "between",
                padding: 16,
                margin: 8,
                backgroundColor: "#f9f9f9",
                borderRadius: 8,
                boxShadow: "0 2px 4px rgb(0 0 0 / 0.1)",
                textAlign: "center",
            }}
        >
            <div style={{ fontSize: 14, color: "#666", marginBottom: 1 }}>{label}</div>
            <div style={{ fontSize: 10, color: "#777", marginBottom: 5 }}>{subtitle}</div>
            <div style={{ fontSize: 20, fontWeight: "bold", color }}>$ {value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}</div>
        </div>
    );
}

export default StatCard;