const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require("cors");
const { port } = require('./src/config/config');
const { connectToDB } = require('./src/config/db.config');
const { errorHandler } = require('./src/uitls/errorHandler');

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.text({ limit: "50mb" }));

app.use(fileUpload());
app.use(cors());

const adminRoutes = require('./src/routes/v1/adminRoutes');
const checkoutRoutes = require('./src/routes/v1/checkoutRoutes');
const userRoutes = require('./src/routes/v1/userRoutes');
const fabricRoutes = require('./src/routes/v1/fabricRoutes');
const categoryRoutes = require('./src/routes/v1/categoryRoutes');
const dashboardRoutes = require('./src/routes/v1/dashboardRoutes');
const enquiryRoutes = require('./src/routes/v1/enquiryRoutes');

app.use("/userImages", express.static(__dirname + "/userImages"));
app.use("/fabricImages", express.static(__dirname + "/fabricImages"));
app.use("/categoryImages", express.static(__dirname + "/categoryImages"));
app.use("/icons", express.static(__dirname + "/icons"));
app.use("/bannerImages", express.static(__dirname + "/bannerImages"));

app.use("/", adminRoutes);
app.use("/", userRoutes);
app.use("/", fabricRoutes);
app.use("/", categoryRoutes);
app.use("/", dashboardRoutes);
app.use("/", enquiryRoutes);
app.use("/", checkoutRoutes);


app.get("/", (req, res) => {
    res.send("<h1>Fabric App is Up and Running</h1>");
});

// Last middleware if any error comes
app.use(errorHandler);

app.listen(port, async() => {
    console.log("Server is running on port", port);

    await connectToDB();
    console.log("Database connected");
});

