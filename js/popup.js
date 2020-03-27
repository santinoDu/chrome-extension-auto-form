const LIST_STORAGE_KEY = 'LIST_STORAGE';

const storage = {
  set(key, value, callback) {
    chrome.storage.local.set({[key]: value}, callback);
  },
  get(key, callback) {
    chrome.storage.local.get([key], callback);
  }
}

const dom = {
  parents(node, className) {
    while (node) {
      if (node.classList.contains(className)) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  }
}

function checkFillBtnStatus() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const { url } = tabs[0];
    storage.get(LIST_STORAGE_KEY, function(result) {
      const list = result[LIST_STORAGE_KEY] || [];
      const index = list.find(item => item.url === url);
      const fillBtnEl = document.getElementById('fill_btn');
      fillBtnEl.style.display = index ? 'inline-block' : 'none';
    });
  });
}

function renderList() {
  storage.get(LIST_STORAGE_KEY, function(result) {
    const list = result[LIST_STORAGE_KEY] || [];
    const str = list.reduce((temp, item, index) => {
      return temp + `<div class="form-item j_item clearfix" data-index="${index}">
        <span><img class="j_blink" src="${item.favIconUrl}" /></span>
        <span title="${item.title}" class="content" contenteditable>${item.title}</span>
        <span title="${item.url}" class="content j_blink">${item.url}</span>
        <span class="j_delete">删除</span>
      </div>`;
    }, '');
    document.getElementById('form_box').innerHTML = str || '添加第一个表单记忆吧~';
    checkFillBtnStatus();
  });
};

document.getElementById('fill_btn').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const { url, id } = tabs[0];
    storage.get(LIST_STORAGE_KEY, function(result) {
      const list = result[LIST_STORAGE_KEY] || [];
      const index = list.findIndex(item => item.url === url);
      if (index !== -1) {
        const inputs = list[index].inputs;
        console.log('fill inputs', inputs);
        chrome.tabs.sendMessage(id, {type: "FORM_FILL", inputs}, function(response) {
          console.log(response, 'res')
        });
      }
    });
  });
})

document.getElementById('add').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const { title, url, favIconUrl, id } = tabs[0];
    chrome.tabs.sendMessage(id, {type: "FORM_ASSEMBLY"}, function(response) {
      const inputs = response.inputs;
      storage.get(LIST_STORAGE_KEY, function(result) {
        const list = result[LIST_STORAGE_KEY] || [];
        list.push({ title, url, favIconUrl, inputs });
        console.log(list, 'listt')
        storage.set(LIST_STORAGE_KEY, list, renderList);
      });
    });
  });
});

document.getElementById('form_box').addEventListener('input', function(e) {
  const target = e.target;
  const parent = dom.parents(target, 'j_item');
  const index = parent.getAttribute('data-index');
  const title = target.innerText;
  storage.get(LIST_STORAGE_KEY, function(result) {
    const list = result[LIST_STORAGE_KEY];
    list[index].title = title || '-';
    storage.set(LIST_STORAGE_KEY, list);
  });
});

document.getElementById('form_box').addEventListener('click', function(e) {
  const target = e.target;
  const classList = target.classList;
  const parent = dom.parents(target, 'j_item');
  const index = parent.getAttribute('data-index');
  storage.get(LIST_STORAGE_KEY, function(result) {
    const list = result[LIST_STORAGE_KEY] || [];
    if (classList.contains('j_delete')) {
      list.splice(index, 1);
      storage.set(LIST_STORAGE_KEY, list, renderList);
    } else if (classList.contains('j_blink')) {
      const { inputs, url } = list[index];
      chrome.tabs.update({url: url}, function(tab){
        // 未找到可以用的事件保证dom已加载完毕，所以此处延时1s
        setTimeout(() => {
          console.log('fill inputs', inputs);
          chrome.tabs.sendMessage(
            tab.id,
            {type: "FORM_FILL", inputs},
            function(response) {
              console.log(response, 'res');
            }
          );
        }, 1000);
      });
    }
  });
})

renderList();
