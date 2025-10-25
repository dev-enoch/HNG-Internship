const express = require("express");
const cors = require("cors");
const stage1Routes = require("./routes/stage1");
const stage2Routes = require("./routes/stage2");
const countriesRouter = require("./routes/countries");
const statusRouter = require("./routes/status");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/", stage1Routes);
app.use("/", stage2Routes);

app.use("/countries", countriesRouter);
app.use("/status", statusRouter);

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
