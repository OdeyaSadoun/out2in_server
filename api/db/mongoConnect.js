const mongoose = require("mongoose");
const { config } = require("../config/secret");

main().catch((err) => console.log(err));

async function main() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(
    `mongodb+srv://${config.userDb}:${config.passDb}@odeyadb.xpv35qj.mongodb.net/out2in`
  );
  console.log("mongo connect out2in");
}
