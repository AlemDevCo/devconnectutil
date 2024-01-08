import { Schema, model } from "mongoose"

let postsSchema = new Schema({
    creator: String,

    post_status: String,
    post_reviewer: String,

    selected_type: String,
    selected_role: String,
    selected_paymentmethod: String,

    title: String,
    description: String,

    payment_robux: String,
    payment_usd: String,
    payment_percentage: String,

    post_created: String,
})

export default model("Marketplace Posts", postsSchema, "Marketplace Posts")