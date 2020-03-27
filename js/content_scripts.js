
function getFromsArr() {
  const selector = 'input:not([type="submit"]):not([type="hidden"]):not([type="button"]), textarea, select';
  return [...document.querySelectorAll(selector)];
}

function formAssemble() {
  return getFromsArr().map(input => {
      return {
        type: input.getAttribute('type'),
        value: input.value,
        checked: input.checked
      }
    });
}

// function triggerEvent(element, eventName) {
//   const event = new Event(eventName);
//   element.dispatchEvent(event);
// }

function triggerEvent(input, key, value) {
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, key).set
  setValue.call(input, value);
  const event = new Event('input', {bubbles: true})
  input.dispatchEvent(event)
}

function setForm(inputs) {
  getFromsArr().forEach((input, index) => {
    if (!inputs[index]) return;
    if (['radio', 'checkbox'].includes(input.getAttribute('type'))) {
      triggerEvent(input, 'checked', inputs[index].checked);
    } else {
      triggerEvent(input, 'value', inputs[index].value);
    }
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    const { type, inputs } = request;
    if (type === 'FORM_ASSEMBLY') {
      sendResponse({inputs: formAssemble()});
    } else if (type === 'FORM_FILL') {
      setForm(inputs);
      sendResponse('done');
    }
  });
