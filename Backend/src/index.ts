import app, { main } from "./app";
import { config } from "dotenv";

config();
const PORT = process.env.PORT || 3000;

main();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

