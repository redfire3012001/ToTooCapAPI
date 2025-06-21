require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const authRoutes = require("./routes/auth-routes");
const cartRoutes = require("./routes/cart-routes");
const productRoutes = require("./routes/product-routes");
const shopRoutes = require("./routes/shop-routes");
const categoryRoutes = require("./routes/category-routes");
const customDesignRoutes = require("./routes/custom-design-routes");
const orderRoutes = require("./routes/order-routes");
const paymentRoutes = require("./routes/payment-routes");
const errorMiddleware = require("./middleware/error-handling-middlewar");

connectToDB();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
const swaggerDocument = YAML.load('./config/swagger.yaml');

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/product", productRoutes);
app.use("/shop", shopRoutes);
app.use("/category", categoryRoutes);
app.use("/customDesign", customDesignRoutes);
app.use("/order", orderRoutes);
app.use("/payment", paymentRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is now listening on PORT ${PORT}`);
});
