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

function sayHello(call, callback) {
  const { name } = call.request;
  console.log(`server receive name: ${chalk.yellow(name)}`);
  callback(null, { message: `hello ${name}` });
}

server.addService(helloProto.HelloWorld.service, { sayHello });

server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`server listen: ${chalk.green(PORT)}`);
    server.start();
  }
});
