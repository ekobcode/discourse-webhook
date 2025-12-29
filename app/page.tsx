export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        background: "#f4f4f5"
      }}
    >
      <main
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        }}
      >
        <h1 style={{ fontSize: "24px", marginBottom: "12px" }}>
          Discourse Middleware Webhook
        </h1>

        <p style={{ fontSize: "16px", color: "#555" }}>
          This service handles webhook events from Discourse and synchronizes
          user activity with external systems such as Shopify.
        </p>

        <hr style={{ margin: "24px 0" }} />

       
      </main>
    </div>
  );
}
