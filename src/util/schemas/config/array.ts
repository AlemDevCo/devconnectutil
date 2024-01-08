import { Schema, model } from "mongoose"

let configSchema = new Schema({
    key: String,
    value: Array,
})

export default model("Array Configuration", configSchema, "Array Configuration")