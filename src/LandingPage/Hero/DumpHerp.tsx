<div
className="hero"
style={{
  // height: "100vh",
  display: "flex",

  flexDirection: "column",
  backgroundColor: getBackgroundColor(),
  color: getTextColor(),
}}
>
<div className="hero-content">
  {/* 🇳🇬 Label */}
  <span
    style={{
      fontSize: 14,
      fontWeight: "600",
      color:
        selectedProvider === "Airtel"
          ? "#fff"
          : selectedProvider === "MTN"
          ? "#fff"
          : "#FFF",
      backgroundColor:
        selectedProvider === "Airtel"
          ? "#ffffff32"
          : selectedProvider === "MTN"
          ? "#00000065"
          : "#FFFFFF21",
      borderRadius: 400,
      padding: `12px 16px`,
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
    }}
  >
    🇳🇬 Swiftly topup Nigerian bundles <FaArrowRight />
  </span>

  {/* Headline */}
  <h1 style={{ marginTop: 8 }}>
    Get More Data, Pay Less with
    <span style={{ paddingLeft: 8 }}>
      <span style={{ color: getTextColor() }}>Bulk</span>
      <span style={{ color: getTextColor() }}>Up</span>
      <span style={{ color: getTextColor() }}>Data</span>
    </span>
  </h1>

  <p style={{ color: getTextColor() }}>
    Say goodbye to overpriced data plans. Join a smart, affordable way
    to access mobile data through shared bulk purchases. Instant.
    Seamless. Cost-effective.
  </p>


  {/* USSD Provider Selector */}
  <div style={{ marginTop: "1.5rem" }}>
    {!selectedProvider && (
      <p
        style={{
          fontSize: "1rem",
          fontWeight: "500",
          marginBottom: "0.5rem",
          color: "#ccc",
        }}
      >
        Choose a provider
      </p>
    )}

    {/* Provider Buttons */}
    <div
      style={{
        display: "flex",
        gap: "0",
        flexWrap: "wrap",
        // width: "100%",
      }}
      className="provider-buttons-container"
    >
      {providers.map((provider) => (
        <button
          key={provider}
          onClick={() => setSelectedProvider(provider)}
          style={{
            backgroundColor: "transparent",

            border:
              selectedProvider === provider
                ? selectedProvider === "MTN"
                  ? "2px solid #000"
                  : "1px solid #fff"
                : "1px solid transparent",
            borderRadius: "24px",
            padding: `14px 7px`,
            width: "fit-content",
          }}
        >
          <span
            style={{
              width: "100%",
              backgroundColor:
                provider === "Airtel"
                  ? "#fff"
                  : provider === "MTN"
                  ? "#fff"
                  : provider === "Glo"
                  ? "#fff"
                  : provider === "9mobile"
                  ? "#fff"
                  : "#FFFFFF21",
              color: "#000",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontWeight: "600",
              borderRadius: "24px",
            }}
          >
            {provider}
          </span>
        </button>
      ))}
    </div>
  </div>

  {/* Roll-down package info */}
  <div
    style={{
      maxHeight: selectedProvider ? "300px" : "0px",
      overflow: "hidden",
      transition: "max-height 0.5s ease-in-out, padding 0.5s",
      backgroundColor:
        selectedProvider === "MTN"
          ? "#000"
          : selectedProvider === "Airtel"
          ? "#121212"
          : "#ffffff",
      color:
        selectedProvider === "Glo" || selectedProvider === "9mobile"
          ? "#000"
          : "#fff",
      marginTop: "2rem",
      padding: selectedProvider ? "1.5rem" : "0",
      borderRadius: "12px",
      width: "100%", // ✅ ensures full width
      boxSizing: "border-box", // ✅ avo
    }}
  >
    {(() => {
      const bundles = [
        {
          network: "MTN",
          size: "5GB",
          price: "₦1,500",
          validity: "7 Days",
          image: mtnImg,
        },
        {
          network: "Airtel",
          size: "10GB",
          price: "₦2,800",
          validity: "30 Days",
          image: airtelImg,
        },
        {
          network: "Glo",
          size: "10GB",
          price: "₦2,800",
          validity: "30 Days",
          image: gloImg,
        },
        {
          network: "9mobile",
          size: "10GB",
          price: "₦2,800",
          validity: "30 Days",
          image: EtisalatImg,
        },
      ];

      const selected = bundles.find(
        (b) =>
          b.network.toLowerCase() === selectedProvider.toLowerCase()
      );

      if (!selected) return null;

      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <img
            src={selected.image}
            alt={`${selected.network} logo`}
            style={{
              height: "64px",
              width: "64px",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
          <div>
            <h2 style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>
              {selected.size} – {selected.price}
            </h2>
            <p style={{ margin: 0, fontWeight: 500 }}>
              Validity: {selected.validity}
            </p>
            <p style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
              Enjoy affordable bulk data rates with {selected.network}.
            </p>
          </div>
        </div>
      );
    })()}
  </div>

  <BuyDataModal
    isOpen={showModal}
    onClose={() => setShowModal(false)}
  />
</div>
</div>