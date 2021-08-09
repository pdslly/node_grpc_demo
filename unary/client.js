import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import chalk from "chalk";
import path from "path";

const PROTO_PATH = path.resolve("proto/helloworld.proto");
const PORT = "0.0.0.0:4500";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const helloProto = grpc.loadPackageDefinition(packageDefinition).proto;

const client = new helloProto.HelloWorld(
  PORT,
  grpc.credentials.createInsecure()
);

client.sayHello({ name: "lxy" }, (err, res) => {
  console.log(`receive message: ${chalk.green(res.message)}`);
});
