import Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";
dotenv.config();

const accountApi = new Brevo.AccountApi();
accountApi.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;

try {
  const account = await accountApi.getAccount();
  console.log("✅ API Verified:", account.email);
} catch (error) {
  console.error("❌ Invalid API key:", error.response?.body || error.message);
}
