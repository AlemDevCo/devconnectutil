import { Schema, model } from "mongoose"

let configSchema = new Schema({
    key: String,
    value: String,
})

export default model("Configuration", configSchema, "Configuration")