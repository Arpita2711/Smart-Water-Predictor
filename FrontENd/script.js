window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("predictBtn").addEventListener("click", function () {
        console.log("✅ Predict button clicked");

        let ph = document.getElementById("ph").value;
        let oxygen = document.getElementById("oxygen").value;
        let salinity = document.getElementById("salinity").value;

        console.log("📊 Inputs:", { ph, oxygen, salinity });

        if (ph && oxygen && salinity) {
            fetch("/api/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ph: parseFloat(ph),
                    dissolvedOxygen: parseFloat(oxygen),
                    salinity: parseFloat(salinity),
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("📥 Response:", data);
                    if (data.result) {
                        document.getElementById("result").innerText = "Prediction: " + data.result;
                    } else {
                        document.getElementById("result").innerText = "Error: " + (data.error || "Unknown error");
                    }
                })
                .catch((err) => {
                    console.error("❌ Fetch error:", err);
                    document.getElementById("result").innerText = "Something went wrong.";
                });
        } else {
            document.getElementById("result").innerText = "Please enter all values.";
        }
    });

    document.getElementById("uploadBtn").addEventListener("click", function () {
        let file = document.getElementById("csvFile").files[0];
        if (file) {
            alert("File uploaded: " + file.name);
            // 🔜 Optional: implement CSV logic here
        } else {
            alert("Please select a file.");
        }
    });
});
