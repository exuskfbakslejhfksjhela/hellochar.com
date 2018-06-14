import * as React from "react";
import * as ReactDOM from "react-dom";

import "./monkeypatch";

import App from "./app";

import "./index.scss";

const root = document.createElement("div");
document.body.appendChild(root);
root.className = "root";
ReactDOM.render(<App />, root);
