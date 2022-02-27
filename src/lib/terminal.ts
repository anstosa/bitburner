import { NS } from "Bitburner";

export const runCommand = (ns: NS, command: string): void => {
  // click terminal
  const terminalButton = document.querySelector(".jss4172");
  if (!terminalButton) {
    ns.alert("Could not find terminal button");
    return;
  }
  (terminalButton as HTMLElement).click();

  // enter command
  const terminalInput = document.getElementById("terminal-input");
  if (!terminalInput) {
    ns.alert("Could not find terminal input");
    return;
  }
  (terminalInput as HTMLInputElement).value = `home;${command}`;

  // trigger enter key
  const handler = Object.keys(terminalInput)[1];
  terminalInput[handler].onChange({ target: terminalInput });
  terminalInput[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
};
