import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import Flutterwave from "flutterwave-node-v3";

async function startServer() {
  try {
    const app = express();
    const PORT = 3000;

    app.use(cors());
    app.use(express.json());

    // In-memory store for payment verification (for demo/POC)
    // In a real app, use Redis or a Database
    const verifiedPayments = new Set<string>();

    // Initialize Flutterwave
    const publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY;
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

    if (!publicKey || !secretKey) {
      console.warn("WARNING: Flutterwave API keys are missing. Payment verification will not work.");
    }

    // Guard against Flutterwave initialization error if keys are null/empty
    let flw: any = null;
    if (publicKey && secretKey) {
      try {
        flw = new Flutterwave(publicKey, secretKey);
      } catch (e) {
        console.error("Failed to initialize Flutterwave:", e);
      }
    }

    // Webhook endpoint for Flutterwave
    app.post("/api/webhook", (req, res) => {
      const secretHash = process.env.FLUTTERWAVE_WEBHOOK_HASH;
      const signature = req.headers["verif-hash"];

      if (!signature || signature !== secretHash) {
        // This is not from Flutterwave!
        return res.status(401).end();
      }

      const payload = req.body;
      console.log("Webhook received:", payload);

      if (payload.status === "successful" || payload.event === "charge.completed") {
        // For webhooks, tx_ref or id is usually used
        const txRef = payload.tx_ref || payload.data?.tx_ref;
        if (txRef) {
          verifiedPayments.add(txRef);
          console.log(`Payment confirmed for ref: ${txRef}`);
        }
      }

      res.status(200).end();
    });

    // Check if a payment is verified
    app.get("/api/verify-payment/:txRef", (req, res) => {
      const { txRef } = req.params;
      if (verifiedPayments.has(txRef)) {
        res.json({ verified: true });
      } else {
        res.json({ verified: false });
      }
    });

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
      console.log("Starting Vite in middleware mode...");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
