## GRPC 是什么

[GRPC](https://grpc.io/) 是 Google 开源的一款高性能 ==RPC== 框架，那么 RPC 究竟是做什么的呢？请看下面的例子

```js
function sum(a, b) {
  return a + b;
}

function callSum() {
  const total = sum(10, 20);
  console.log("total = ", total);
}
```

我们有一个函数 `sum` 和 `callSum`, `sum` 计算并返回 ==a + b==, `callSum` 负责调用函数 `sum`,并输出计算的结果。

`callSum` 调用 `sum` 是一个普通的函数调用。

现在如果函数 `sum` 和 `callSum` 处于不同的地址空间，或者他们位于不同的主机中，则该函数调用被称为==远程过程调用(rpc)==。包含函数 `sum` 的主机为服务端，包含函数 `callSum` 的主机为用户端。

## Protocol Buffer 是什么

[proto2](https://developers.google.com/protocol-buffers/docs/proto2), [proto3](https://developers.google.com/protocol-buffers/docs/proto3) 是 ==GRPC== 中默认使用的接口定义语言。

- 它帮助定义服务器提供的各种服务
- 它帮助定义系统中使用的有效载荷的结构
- 它帮助序列化消息（特殊二进制格式），并通过服务器与用户端之间的线路发送它。

## 如何在 Nodejs 中使用 GRPC

### 项目目录

```
rpc
├── client_stream
│   │── client.js
│   └── server.js
│── package.json
├── proto
│   └── helloworld.proto
│── readme.md
├── server_stream
│   │── client.js
│   └── server.js
├── unary
│   │── client.js
│   └── server.js
│── util.js
└── yarn.lock
```

### package.json 配置

```json
{
  "name": "rpc",
  "version": "1.0.0",
  "description": "",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@grpc/grpc-js": "^1.3.6",
    "@grpc/proto-loader": "^0.6.4",
    "chalk": "^4.1.2",
    "lodash": "^4.17.21"
  }
}
```

### 定义 Protocol Buffer

```
syntax = "proto3";

package proto;
option go_package = ".;proto"; // golang用 可以忽略

service HelloWorld {
    rpc sayHello (HelloReq) returns (Response) {} // 一元RPC
    rpc sayHi (HiReq) returns (stream Response) {} // 服务端流式RPC
    rpc sum (stream sumReq) returns (Response) {} // 客户端流式RPC
}

message HelloReq {
    string name = 1;
}

message HiReq {
    repeated string names = 1;
}

message sumReq {
    int32 num = 1;
}

message Response {
    string message = 1;
}
```

### 一元 RPC
