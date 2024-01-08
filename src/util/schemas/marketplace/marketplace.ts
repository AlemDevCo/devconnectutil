import { Schema, model } from "mongoose"

let marketplaceSchema = new Schema({
    name: String,
    channel_id: String,
})

export default model("Marketplace", marketplaceSchema, "Marketplace")