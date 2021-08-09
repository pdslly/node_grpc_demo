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
const server = new grpc.Server();

function sum(call, callback) {
  let total = 0;

  call.on("data", ({ num }) => {
    console.log(`server receive num: ${chalk.green(num)}`);
    total += Number(num);
  });

  call.on("end", () => {
    callback(null, { message: `result: ${total}` });
  });
}

server.addService(helloProto.HelloWorld.service, { sum });

server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`server listen: ${chalk.green(PORT)}`);
    server.start();
  }
});
