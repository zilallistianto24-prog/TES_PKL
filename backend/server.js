const app = require("./src/app");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
  console.log("Swagger on http://localhost:5000/api-docs");
});
