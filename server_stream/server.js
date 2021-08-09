import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import chalk from "chalk";
import path from "path";

import { wait } from "../util.js";

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

async function sayHi(call) {
  const { names } = call.request;

  for (const name of names) {
    call.write({ message: `hi ${name}` });
    await wait(1500);
  }
  call.end();
}

server.addService(helloProto.HelloWorld.service, { sayHi });

server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`server listen: ${chalk.green(PORT)}`);
    server.start();
  }
});
