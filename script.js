const button = document.getElementById("button");
const callstackContainer = document.querySelector(".callstack-container");
const microtaskContainer = document.querySelector(".microtask-container");
const macrotaskContainer = document.querySelector(".macrotask-container");
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

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const runEventLoop = async(codes) => {
  const callStack = [];
  const microtasks = [];
  const macrotasks = [];
  for (const code of codes) {
    if (code.startsWith("console.log")) {
      callStack.push(code);
      renderAll(callStack, microtasks, macrotasks);
      await sleep(600);
      console.log("執行", code);
      callStack.pop();
      renderAll(callStack, microtasks, macrotasks);
      await sleep(600);
    } else if (code.startsWith("setTimeout")) {
      macrotasks.push(code);
      renderAll(callStack, microtasks, macrotasks);
      await sleep(600);
    } else if (
      code.startsWith("Promise") ||
      code.startsWith("queueMicrotask")
    ) {
      microtasks.push(code);
      renderAll(callStack, microtasks, macrotasks);
      await sleep(600);
    }
  };
  while (microtasks.length > 0) {
    console.log("執行", microtasks.shift());
    renderAll(callStack, microtasks, macrotasks);
    await sleep(600);
  }
  while (macrotasks.length > 0) {
    console.log("執行", macrotasks.shift());
    renderAll(callStack, microtasks, macrotasks);
    await sleep(600);
    while (microtasks.length > 0) {
      console.log("執行", microtasks.shift());
      renderAll(callStack, microtasks, macrotasks);
      await sleep(600);
    }
  }
  renderAll(callStack, microtasks, macrotasks);
};

const renderQueues = (container, tasks) => {
  container.replaceChildren();
  tasks.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.textContent = task;
    taskElement.className = "task-item";
    container.appendChild(taskElement);
  });
};

const renderAll = (callStack, microtasks, macrotasks) => {
  renderQueues(callstackContainer, callStack);
  renderQueues(microtaskContainer, microtasks);
  renderQueues(macrotaskContainer, macrotasks);
};
