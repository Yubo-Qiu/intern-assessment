const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class Task extends Model {}

Task.init(
  {
    // Define attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending", // Set default value to "pending"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true, // Allow null if description is optional
    },
  },
  {
    sequelize, // Pass the connection instance
    modelName: "Task", // Name your model
    timestamps: true, // Enable automatic creation of createdAt & updatedAt fields
    tableName: "Tasks", // Explicitly define the table name
  },
);

module.exports = Task;
