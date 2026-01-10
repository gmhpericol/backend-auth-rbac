
import app from "./app.js";
import { exec } from "child_process";
import { startScheduler } from "./scheduler/index.js";

startScheduler();

if (process.env.NODE_ENV === "production") {
  exec("npx prisma migrate deploy", (error, stdout, stderr) => {
    if (error) {
      console.error("Migration error:", error);
    }
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
