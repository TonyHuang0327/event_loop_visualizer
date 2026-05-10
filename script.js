const button = document.getElementById("button");
// 先跑同步；之後每輪：清空 microtasks -> 執行 1 個 macrotask -> 再清空 microtasks
button.addEventListener("click", () => {
  console.log("button clicked");
  const codeArea = document.querySelector(".javascript-code-area");
  const codeAreaContents = codeArea.querySelectorAll(
    ".javascript-code-area-content",
  );
  const codes = [...codeAreaContents].map((item) => item.textContent.trim());
  runEventLoop(codes);
});

const runEventLoop = (codes) => {
  const callStack = [];
  const microtasks = [];
  const macrotasks = [];
  console.log("分類 event loop");
  for (const code of codes) {
    if (code.startsWith("setTimeout")) {
      macrotasks.push(code);
    } else if (
      code.startsWith("Promise") ||
      code.startsWith("queueMicrotask")
    ) {
      microtasks.push(code);
    } else {
      callStack.push(code);
    }
  }
  console.log("執行 event loop");
  flushCallStack(callStack);
  flushMicrotasks(microtasks);
  flushMacrotasks(macrotasks, microtasks);
};
const flushMicrotasks = (microtasks) => {
  while (microtasks.length > 0) {
    const task = microtasks.shift();
    console.log(task);
  }
};
const flushMacrotasks = (macrotasks, microtasks) => {
  while (macrotasks.length > 0) {
    const task = macrotasks.shift();
    console.log(task);
    flushMicrotasks(microtasks);
  }
};
const flushCallStack = (callStack) => {
  while (callStack.length > 0) {
    const task = callStack.shift();
    console.log(task);
  }
};
